import environment from '../environments/environment'

export async function getClasesProfesor(idProfesor, token) {
  const response = await fetch(`${environment.apiUrl}/turnos-clase/profesor/${idProfesor}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error('Error al obtener las clases del profesor')
  }
  return response.json()
}
