import {
    MenuButtonBold,
    MenuButtonItalic,
    MenuButtonStrikethrough,
    MenuButtonEditLink,
    MenuButtonOrderedList,
    MenuButtonBulletedList,
    MenuButtonBlockquote,
    MenuButtonCode,
    MenuButtonCodeBlock,
    // MenuButtonAddTable, this errors for some reason
    MenuControlsContainer,
    MenuDivider,
    MenuSelectHeading,
    RichTextEditorProvider,
    RichTextField,
    LinkBubbleMenu
} from "mui-tiptap";
import { Box } from '@mui/material';


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