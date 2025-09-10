import axios from 'axios'

export async function uploadToS3(file: File): Promise<string | null> {
  try {
    const presignedRes = await axios.get('http://localhost:3001/s3/url', {
      params: {
        filename: file.name,
        type: file.type,
      },
    })

    const { url, fileUrl } = presignedRes.data

    await axios.put(url, file, {
      headers: {
        'Content-Type': file.type,
      },
    })

    return fileUrl
  } catch (err) {
    console.error('S3 Upload Error:', err)
    return null
  }
}

