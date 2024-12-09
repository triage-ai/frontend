import { Box, IconButton, Menu, Stack, styled, Typography } from "@mui/material";
import { CloudUpload, Send } from "lucide-react";
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
    RichTextField,
    MenuButton,
    RichTextReadOnly,
    FontSize
} from "mui-tiptap";


export const RichTextEditorBox = ({ editor, children, footer, PostButton }) => {

    return (
        <Box>
            <RichTextEditorProvider editor={editor}>
                <StyledRichTextField
                    RichTextContentProps={{
                        className: 'App-rich-text-field',
                    }}
                    controls={
                        <MenuControlsContainer>
                            {/* <MenuSelectHeading /> */}
                            <Box display='flex' flexDirection='row' alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
                                <Box display='flex' flexDirection='row' alignItems={'center'} gap={'2.4px'}>


                                    <MenuButtonBold />
                                    <MenuButtonItalic />
                                    <MenuButtonStrikethrough />
                                    <MenuDivider />
                                    {/* <MenuButtonEditLink /> */}
                                    <MenuButtonOrderedList />
                                    <MenuButtonBulletedList />
                                    <MenuDivider />
                                    <MenuButtonBlockquote />
                                    <MenuDivider />
                                    {/* <MenuButtonAddTable /> */}
                                    <MenuButtonCode />
                                    <MenuButtonCodeBlock />
                                </Box>
                                {PostButton}
                            </Box>
                        </MenuControlsContainer>
                    }
                    footer={footer}
                >
                    {children}
                </StyledRichTextField>
            </RichTextEditorProvider>
        </Box>
    )

}

const StyledRichTextField = styled(RichTextField)(({ theme }) => ({
    "& .MuiTiptap-FieldContainer-notchedOutline": {
        border: '1.5px solid #E5EFE9',
        transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
        borderRadius: 8,
    },
    "&.MuiTiptap-FieldContainer-root:hover .MuiTiptap-FieldContainer-notchedOutline": {
        backgroundColor: 'transparent',
        border: '1.5px solid #22874E',
    },
    "&.MuiTiptap-FieldContainer-root.Mui-focused .MuiTiptap-FieldContainer-notchedOutline": {
        backgroundColor: 'transparent',
        border: '1.5px solid #22874E',
    },
    ".App-rich-text-field": {
        maxHeight: '200px',
        overflowY: 'scroll'

    },
    "& .ProseMirror": {
        height: '100%',
        "& h1, & h2, & h3, & h4, & h5, & h6": {

        },
        "& p": {
            wordBreak: 'break-all',
            fontSize: 'small',
            fontWeight: 500
        }
    }
}));