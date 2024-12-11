import { useParams } from "react-router-dom"
import { WhiteContainer } from "../../components/white-container"
import { Layout } from "../../components/layout"
import { Box, Hidden, Skeleton, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useTicketBackend } from "../../hooks/useTicketBackend"
import { TicketX } from "lucide-react"
import { EditableInput } from "../../components/editable-input"

export const TicketView = () => {
    const { number } = useParams()

    const { getTicketByNumber } = useTicketBackend()
    const [ticket, setTicket] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
    
        getTicketByNumber(number)
            .then(res => {
                setTicket(res.data)
            })
            .catch(() => {
                console.error('Error while fetching ticket by number')
            })
        setLoading(false)
    }, [])

    return (
        <Layout
            title={'Ticket #' + number}
            subtitle={''}
            buttonInfo={{
                hidden: false
            }}
        >
            <WhiteContainer noPadding>

                {
                    loading ?
                        <Box
                            sx={{
                                width: '100%',
                                // height: '60vh', // whitecontainer min height
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: '65%'
                            }}
                        >
                            <Skeleton variant="rounded" width={210} height={60} />
                            <Skeleton variant="rounded" width={210} height={60} />
                            <Skeleton variant="rounded" width={210} height={60} />
                        </Box>
                    :
                    !ticket ?
                        <Box
                            sx={{
                                width: '100%',
                                height: '60vh', // whitecontainer min height
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: '65%'
                            }}
                        >
                            <TicketX size={80} />
                            <Typography fontWeight={600} variant="h2">
                                You can't view this ticket
                            </Typography>
                            <Typography variant="subtitle2">
                                It may have been deleted or you don't have permission to view it.
                            </Typography>
                        </Box>
                    :
                    <Box
                        // width={'100%'}
                    >
                        <EditableInput
                            value={ticket.title}
                        />

                    </Box>
                }



            </WhiteContainer>

        </Layout>
    )


}