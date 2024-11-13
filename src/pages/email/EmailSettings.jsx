import { MailPlus } from "lucide-react"
import { Layout } from "../../components/layout"
import { WhiteContainer } from "../../components/white-container"






export const EmailSettings = props => {
    return (
        <Layout
		title={'Email Settings'}
		subtitle={'Email settings and options'}
		buttonInfo={{
			label: 'Add new email',
			icon: <MailPlus size={20} />,
			hidden: false,
		}}>
			<WhiteContainer noPadding>
				<p>Email Settings</p>
			</WhiteContainer>		
		</Layout>
    )
}