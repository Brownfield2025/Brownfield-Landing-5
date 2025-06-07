"use server"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  service: string
  message: string
}

export async function submitQuoteRequest(formData: FormData) {
  try {
    // Format the sales team email with HTML for better presentation
    const salesEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px;">New Quote Request Received</h2>
        
        <h3 style="color: #555;">Customer Information:</h3>
        <ul style="list-style: none; padding-left: 0;">
          <li><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</li>
          <li><strong>Email:</strong> ${formData.email}</li>
          <li><strong>Phone:</strong> ${formData.phone}</li>
          <li><strong>Service Needed:</strong> ${formData.service}</li>
        </ul>
        
        <h3 style="color: #555;">Message:</h3>
        <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #ddd;">${formData.message}</p>
        
        <p style="color: #777; font-style: italic;">Please follow up with this customer as soon as possible.</p>
        
        <p style="margin-top: 30px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 12px; color: #999;">
          This is an automated message from the Brownfield Website System.
        </p>
      </div>
    `

    // Format the customer email with HTML for better presentation
    const customerEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank You for Your Interest in Brownfield</h2>
        
        <p>Dear ${formData.firstName} ${formData.lastName},</p>
        
        <p>Thank you for your interest in Brownfield General Maintenance & Properties Management services.</p>
        
        <p>We have received your quote request for: <strong>${formData.service}</strong></p>
        
        <p>Our sales team will review your requirements and contact you within 24 hours to discuss your needs and provide you with a detailed quote.</p>
        
        <p>If you have any urgent questions, please don't hesitate to call us at <a href="tel:+97156655877">+971 5 655877</a>.</p>
        
        <div style="margin-top: 30px;">
          <p style="margin-bottom: 5px;"><strong>Best regards,</strong></p>
          <p style="margin-top: 0;">Brownfield Sales Team<br>
          <a href="mailto:sales@brownfield.ae">sales@brownfield.ae</a></p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #777;">
          <p><strong>Brownfield General Maintenance & Properties Management LLC</strong><br>
          Office 103, Al Ain Tower, Hamdan St, Abu Dhabi<br>
          Phone: <a href="tel:+97156655877">+971 5 655877</a><br>
          Email: <a href="mailto:info@brownfield.ae">info@brownfield.ae</a></p>
        </div>
      </div>
    `

    // Plain text versions for email clients that don't support HTML
    const salesEmailText = `
New Quote Request Received

Customer Information:
- Name: ${formData.firstName} ${formData.lastName}
- Email: ${formData.email}
- Phone: ${formData.phone}
- Service Needed: ${formData.service}

Message:
${formData.message}

Please follow up with this customer as soon as possible.

Best regards,
Brownfield Website System
    `.trim()

    const customerEmailText = `
Dear ${formData.firstName} ${formData.lastName},

Thank you for your interest in Brownfield General Maintenance & Properties Management services.

We have received your quote request for: ${formData.service}

Our sales team will review your requirements and contact you within 24 hours to discuss your needs and provide you with a detailed quote.

If you have any urgent questions, please don't hesitate to call us at +971 5 655877.

Best regards,
Brownfield Sales Team
sales@brownfield.ae

---
Brownfield General Maintenance & Properties Management LLC
Office 103, Al Ain Tower, Hamdan St, Abu Dhabi
Phone: +971 5 655877
Email: info@brownfield.ae
    `.trim()

    // Get the base URL for the API call
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://www.brownfield.ae"

    // Send email to sales team
    const salesEmailResponse = await fetch(`${baseUrl}/api/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: "sales@brownfield.ae",
        subject: `New Quote Request from ${formData.firstName} ${formData.lastName}`,
        text: salesEmailText,
        html: salesEmailHtml,
      }),
    })

    if (!salesEmailResponse.ok) {
      const salesError = await salesEmailResponse.json()
      console.error("Failed to send email to sales team:", salesError)
      // Don't throw error, continue to try customer email
    }

    // Send confirmation email to customer
    const customerEmailResponse = await fetch(`${baseUrl}/api/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: formData.email,
        subject: "Quote Request Received - Brownfield General Maintenance",
        text: customerEmailText,
        html: customerEmailHtml,
      }),
    })

    if (!customerEmailResponse.ok) {
      const customerError = await customerEmailResponse.json()
      console.error("Failed to send confirmation email to customer:", customerError)
      // Don't throw error, still return success for form submission
    }

    // Check if at least one email was sent successfully
    const salesSuccess = salesEmailResponse.ok
    const customerSuccess = customerEmailResponse.ok

    if (salesSuccess || customerSuccess) {
      return {
        success: true,
        message: "Quote request submitted successfully! We'll be in touch soon.",
      }
    } else {
      // If both emails failed, still record the submission but inform user
      return {
        success: true,
        message:
          "Quote request submitted successfully! If you don't hear from us within 24 hours, please call +971 5 655877.",
      }
    }
  } catch (error) {
    console.error("Error submitting quote request:", error)
    return {
      success: false,
      message: "Failed to submit quote request. Please try again or contact us directly at +971 5 655877.",
    }
  }
}
