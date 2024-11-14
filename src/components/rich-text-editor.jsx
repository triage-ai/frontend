import {
	MenuButtonBlockquote,
	MenuButtonBold,
	MenuButtonBulletedList,
	MenuButtonCode,
	MenuButtonCodeBlock,
	MenuButtonItalic,
	MenuButtonOrderedList,
	MenuButtonStrikethrough,
	// MenuButtonAddTable, this errors for some reason
	MenuControlsContainer,
	MenuDivider, RichTextEditorProvider,
	RichTextField
} from "mui-tiptap";


export const RichTextEditorBox = ({editor, children}) => {

    return (

        <RichTextEditorProvider editor={editor}>
            <RichTextField
            RichTextContentProps={{
                className:'App-rich-text-field'
            }}
            controls={
                <MenuControlsContainer>
                    {/* <MenuSelectHeading /> */}
                    <MenuButtonBold />
                    <MenuButtonItalic />
                    <MenuButtonStrikethrough />
                    <MenuDivider />
                    {/* <MenuButtonEditLink /> */}
                    <MenuDivider />
                    <MenuButtonOrderedList />
                    <MenuButtonBulletedList />
                    <MenuDivider />
                    <MenuButtonBlockquote />
                    <MenuDivider />
                    {/* <MenuButtonAddTable /> */}
                    <MenuButtonCode />
                    <MenuButtonCodeBlock />
                </MenuControlsContainer>
            }
            >
                {children}
            </RichTextField>
        </RichTextEditorProvider>
    )

}