enum AppointmentTypes {
    EVENT,
    TASK,
    REMINDER,
    APPOINTMENTSCHEDULE
}

interface IAppointment {
    date: Date
    title?: string
    type?: AppointmentTypes
    guests?: string[]
    location?: string
    descripiton?: string
}

export { IAppointment, AppointmentTypes }