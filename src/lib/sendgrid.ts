import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function sendEmail(to: string, subject: string, text: string) {
  const msg = {
    to,
    from: 'your@email.com',
    subject,
    text,
  }

  try {
    await sgMail.send(msg)
    console.log('Email sent successfully')
  } catch (error) {
    console.error('Error sending email:', error)
  }
}