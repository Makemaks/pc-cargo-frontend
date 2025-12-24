export interface JobTransport {
  id: number
  jobId: number
  sequence: number
  transportMode: string
  origin: string
  destination: string
  status: string
  createdAt: string
  updatedAt?: string
}


export interface CreateJobTransportPayload {
  transport_mode: string
  sequence: number
  origin: string
  destination: string
  status: string
}

export interface UpdateJobTransportPayload {
  transport_mode?: string
  sequence?: number 
  origin?: string
  destination?: string
  status?: string
}
