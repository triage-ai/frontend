import { MailPlus } from "lucide-react"
import { Layout } from "../../components/layout"
import { WhiteContainer } from "../../components/white-container"

export const EmailBanlist = props => {
    return (
        <Layout
		title={'Banlist'}
		subtitle={'View all banned email addresses'}
		buttonInfo={{
			label: 'Add new email',
			icon: <MailPlus size={20} />,
			hidden: false,
		}}>
			<WhiteContainer noPadding>
				<p>Email Banlist</p>
			</WhiteContainer>		
		</Layout>
    )
}