interface SignatureResponse {
  timestamp: string;
  signature: string;
}

export const getSignature = async (): Promise<SignatureResponse> => {
  try {
    const response = await fetch('/api/signature/signatureGet', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Gagal mendapatkan signature:', response.status);
      throw new Error('Gagal mendapatkan signature');
    }

    const data = await response.json();
    console.log('Data signature:', data);
    
    return {
      timestamp: data.signature.timestamp,
      signature: data.signature.signature
    };
  } catch (error) {
    console.error('Error getting signature:', error);
    throw error;
  }
};