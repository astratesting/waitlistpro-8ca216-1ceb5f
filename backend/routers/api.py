import secrets
import string
from collections import Counter
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from database import get_db
from models import EmailLog, Milestone, Referral, WaitlistEntry

router = APIRouter()


class WaitlistCreate(BaseModel):
    email: EmailStr
    segment: str = 'founder'
    source: str = 'direct'
    referred_by: Optional[str] = None


class WaitlistUpdate(BaseModel):
    segment: Optional[str] = None
    access_tier: Optional[str] = None


class MilestoneCreate(BaseModel):
    name: str
    referral_target: int
    reward: str


class EmailLogCreate(BaseModel):
    recipient: EmailStr
    template: str
    status: str = 'queued'
    provider_message_id: Optional[str] = None
    payload: Optional[str] = None


def generate_code(email: str) -> str:
    prefix = ''.join(ch for ch in email.split('@')[0].upper() if ch in string.ascii_uppercase + string.digits)[:6] or 'WLPRO'
    return f'{prefix}-{secrets.randbelow(9000) + 1000}'


def tier_for_referrals(count: int) -> str:
    if count >= 10:
        return 'Founder'
    if count >= 3:
        return 'Beta'
    return 'Preview'


def seed_milestones(db: Session) -> None:
    if db.query(Milestone).count() > 0:
        return
    milestones = [
        Milestone(name='Preview', referral_target=0, reward='Product updates and launch previews'),
        Milestone(name='Beta', referral_target=3, reward='Private beta invite'),
        Milestone(name='Founder', referral_target=10, reward='Founder badge and launch discount'),
    ]
    db.add_all(milestones)
    db.commit()


@router.post('/waitlist')
def create_waitlist_entry(payload: WaitlistCreate, db: Session = Depends(get_db)):
    existing = db.query(WaitlistEntry).filter(WaitlistEntry.email == payload.email).first()
    if existing:
        return existing

    code = generate_code(payload.email)
    while db.query(WaitlistEntry).filter(WaitlistEntry.referral_code == code).first():
        code = generate_code(payload.email)

    entry = WaitlistEntry(
        email=payload.email,
        segment=payload.segment,
        source=payload.source,
        referral_code=code,
        referred_by=payload.referred_by,
    )
    db.add(entry)

    if payload.referred_by:
        referrer = db.query(WaitlistEntry).filter(WaitlistEntry.referral_code == payload.referred_by).first()
        if referrer:
            referrer.referrals_count += 1
            referrer.access_tier = tier_for_referrals(referrer.referrals_count)
            db.add(Referral(referrer_code=payload.referred_by, referred_email=payload.email, entry=entry))

    db.add(EmailLog(recipient=payload.email, template='welcome_waitlist', status='queued', payload=f'segment={payload.segment}'))
    db.commit()
    db.refresh(entry)
    return entry


@router.get('/waitlist')
def list_waitlist_entries(segment: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(WaitlistEntry).order_by(WaitlistEntry.created_at.desc())
    if segment:
        query = query.filter(WaitlistEntry.segment == segment)
    return query.limit(100).all()


@router.get('/waitlist/{entry_id}')
def get_waitlist_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.query(WaitlistEntry).filter(WaitlistEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail='Waitlist entry not found')
    return entry


@router.patch('/waitlist/{entry_id}')
def update_waitlist_entry(entry_id: int, payload: WaitlistUpdate, db: Session = Depends(get_db)):
    entry = db.query(WaitlistEntry).filter(WaitlistEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail='Waitlist entry not found')
    if payload.segment is not None:
        entry.segment = payload.segment
    if payload.access_tier is not None:
        entry.access_tier = payload.access_tier
    db.commit()
    db.refresh(entry)
    return entry


@router.delete('/waitlist/{entry_id}')
def delete_waitlist_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = db.query(WaitlistEntry).filter(WaitlistEntry.id == entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail='Waitlist entry not found')
    db.delete(entry)
    db.commit()
    return {'deleted': True}


@router.get('/referrals')
def list_referrals(db: Session = Depends(get_db)):
    return db.query(Referral).order_by(Referral.created_at.desc()).limit(100).all()


@router.get('/milestones')
def list_milestones(db: Session = Depends(get_db)):
    seed_milestones(db)
    return db.query(Milestone).order_by(Milestone.referral_target.asc()).all()


@router.post('/milestones')
def create_milestone(payload: MilestoneCreate, db: Session = Depends(get_db)):
    milestone = Milestone(name=payload.name, referral_target=payload.referral_target, reward=payload.reward)
    db.add(milestone)
    db.commit()
    db.refresh(milestone)
    return milestone


@router.get('/email-logs')
def list_email_logs(db: Session = Depends(get_db)):
    return db.query(EmailLog).order_by(EmailLog.created_at.desc()).limit(100).all()


@router.post('/email-logs')
def create_email_log(payload: EmailLogCreate, db: Session = Depends(get_db)):
    log = EmailLog(**payload.model_dump())
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


@router.get('/analytics')
def analytics(db: Session = Depends(get_db)):
    entries = db.query(WaitlistEntry).all()
    referrals = db.query(Referral).count()
    emails = db.query(EmailLog).all()
    segments = Counter(entry.segment for entry in entries)
    tiers = Counter(entry.access_tier for entry in entries)
    return {
        'total_waitlist': len(entries),
        'total_referrals': referrals,
        'segments': dict(segments),
        'tiers': dict(tiers),
        'emails_queued': sum(1 for log in emails if log.status == 'queued'),
        'emails_sent': sum(1 for log in emails if log.status == 'sent'),
        'conversion_rate': round((referrals / len(entries)) * 100, 2) if entries else 0,
    }
