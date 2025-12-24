import type { JobTransport } from '@/app/types/job-transport'

export default {
  fetch(transport: any): JobTransport {
    return {
      id: transport.id,
      jobId: transport.job_id,
      sequence: transport.sequence,
      transportMode: transport.transport_mode,
      origin: transport.origin,
      destination: transport.destination,
      status: transport.status,
      createdAt: transport.created_at,
    }
  },

  fetchCollection(transports: any[]): JobTransport[] {
    return transports.map(this.fetch)
  },
}
