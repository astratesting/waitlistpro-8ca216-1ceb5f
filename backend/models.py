from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(120), nullable=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class WaitlistEntry(Base):
    __tablename__ = 'waitlist_entries'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    segment = Column(String(80), default='founder')
    source = Column(String(120), default='direct')
    referral_code = Column(String(40), unique=True, index=True, nullable=False)
    referred_by = Column(String(40), nullable=True)
    referrals_count = Column(Integer, default=0)
    access_tier = Column(String(40), default='Preview')
    created_at = Column(DateTime, default=datetime.utcnow)
    referrals = relationship('Referral', back_populates='entry')


class Referral(Base):
    __tablename__ = 'referrals'

    id = Column(Integer, primary_key=True, index=True)
    referrer_code = Column(String(40), index=True, nullable=False)
    referred_email = Column(String(255), nullable=False)
    entry_id = Column(Integer, ForeignKey('waitlist_entries.id'), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    entry = relationship('WaitlistEntry', back_populates='referrals')


class Milestone(Base):
    __tablename__ = 'milestones'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80), unique=True, nullable=False)
    referral_target = Column(Integer, nullable=False)
    reward = Column(String(255), nullable=False)


class EmailLog(Base):
    __tablename__ = 'email_logs'

    id = Column(Integer, primary_key=True, index=True)
    recipient = Column(String(255), index=True, nullable=False)
    template = Column(String(120), nullable=False)
    status = Column(String(40), default='queued')
    provider_message_id = Column(String(120), nullable=True)
    payload = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
