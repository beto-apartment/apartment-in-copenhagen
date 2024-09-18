import axios from 'axios'

const baseUrl = '/api'

// Function to send email
export const sendEmail = async (emailData) => {
  try {
    // Perform the POST request
    const response = await axios.post(`${baseUrl}/sendEmail`, emailData)
    return response.data // Return the response data if needed
  } catch (error) {
    // Log the error or handle it as needed
    console.error('Error sending email:', error)
    throw error // Rethrow the error to be handled by the caller
  }
}
