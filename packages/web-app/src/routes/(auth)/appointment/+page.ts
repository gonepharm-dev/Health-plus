export const load = async ({ url }) => {
    const role = url.searchParams.get('role');
    const appointmentId = url.searchParams.get('appointmentId');
    
    return {
      role: role === 'doctor' ? 'doctor' : 'patient',
      appointmentId
    };
  };
  
  