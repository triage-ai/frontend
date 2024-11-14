import { Typography, Stack, IconButton, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { CustomFilledInput } from '../../../components/custom-input';
import { RichTextEditorBox } from '../../../components/rich-text-editor';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Check, Pencil, X } from 'lucide-react';
import { useTemplateBackend } from '../../../hooks/useTemplateBackend';


export const TemplateDetail = ({ templateInfo, closeDrawer, openEdit }) => {
    const [template, setTemplate] = useState(null)
    const { getTemplateById } = useTemplateBackend();


	// const handleChange = (entry) => {
	// 	console.log(formData);
	// 	setFormData({
	// 		...formData,
	// 		[entry.target.name]: entry.target.value,
	// 	});

	// 	setLoading(false);
	// };

	const openEditModal = (event, template) => {
		closeDrawer();
		openEdit(template, 'edit');
	};

    // const templateSave = (formData, templateInfo, updateTemplate, setLoading) => {
    //     formData['body'] = editor.getHTML();
    //     var updates = {...templateInfo}
    //     try {
    //         Object.entries(formData).forEach((update) => {
    //             updates[update[0]] = update[1];
    //         });
    //         updateTemplate(updates);
    //         setLoading(true);
    //     } catch (error) {
    //         console.error("Error with saving template", error)
    //     }
    // }

    useEffect(() => {
		if (templateInfo) {
			getTemplateById(templateInfo.template_id)
				.then(response => response.data)
				.then(template => {
					setTemplate(template);
                    editor.commands.setContent(template.body)
				})
		}
	}, [templateInfo]);

    const editor = useEditor({
		extensions: [StarterKit],
		content: template?.body,
        editable: false,
	});


	return (
        <Box sx={{ height: '100%', bgcolor: '#FFF' }}>
                <Box sx={{ height: '100%', padding: '28px', position: 'relative'  }}>
                    <Box
                        sx={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            // marginBottom: '10px',
                            
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Stack direction='row'>
                                <Typography variant='h2'>{template?.template_name}</Typography>
                            </Stack>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton onClick={(event) => openEditModal(event, template)}>
                                <Pencil color='#22874E' size={16} />
                            </IconButton>

                            <Box sx={{ borderLeft: '1.5px solid #E5EFE9', height: '24px' }} ml={1} mr={1} />

                            <IconButton sx={{ borderRadius: '8px' }} aria-label='edit' onClick={closeDrawer}>
                                <X color='#6E7772' strokeWidth={1.5} />
                            </IconButton>
                        </Box>

                    </Box>

                    
                    <Typography variant='subtitle1' pb={2}>
                        Email Subject and Body
                    </Typography>

                    <CustomFilledInput label='Subject' name='subject' sx={{ width: 430, pb: 4 }} value={template?.subject} disabled/>

                    <Box sx={{ maxWidth: 1000, pb: 4 }}>
                        <RichTextEditorBox editor={editor} />
                    </Box>

                    <CustomFilledInput label='Notes' name='notes' sx={{ width: 430, pb: 4 }} value={template?.notes} disabled/>

                    
                    {/* <CircularButton
                        sx={{ py: 1, px: 6, width: 250 }}
                        onClick={() => templateSave(formData, templateInfo, updateTemplate, setLoading, setCircleLoading)}
                        disabled={loading || circleLoading}
                    >
                        {circleLoading ? <CircularProgress size={22} thickness={5} sx={{ color: '#FFF' }} /> : 'Save Changes'}
                    </CircularButton> */}
                       
                </Box>
        </Box>
	);
};
