import { Typography, Stack, IconButton, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { CustomFilledInput } from '../../../components/custom-input';
import { RichTextEditorBox } from '../../../components/rich-text-editor';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Check, Pencil, X } from 'lucide-react';
import { useTemplateBackend } from '../../../hooks/useTemplateBackend';


export const TemplateDetail = ({ templateInfo, closeDrawer }) => {
	const [loading, setLoading] = useState(true);
	const [editable, setEditable] = useState(true);
    const { updateTemplate, getTemplateById } = useTemplateBackend();
	const [formData, setFormData] = useState({
		code_name: templateInfo?.code_name ,
		subject: templateInfo?.subject || '',
		notes: templateInfo?.notes || '',
		body: templateInfo?.body || '',
	});

	const handleChange = (entry) => {
		console.log(formData);
		setFormData({
			...formData,
			[entry.target.name]: entry.target.value,
		});

		setLoading(false);
	};

	const toggleEdit = () => {
		setEditable((p) => !p);
	};

    const editor = useEditor({
		extensions: [StarterKit],
		content: formData.body,
        onUpdate: () => {setLoading(false)}
	});

    const templateSave = (formData, templateInfo, updateTemplate, setLoading) => {
        formData['body'] = editor.getHTML();
        var updates = {...templateInfo}
        try {
            Object.entries(formData).forEach((update) => {
                updates[update[0]] = update[1];
            });
            updateTemplate(updates);
            setLoading(true);
        } catch (error) {
            console.error("Error with saving template", error)
        }
    }

    useEffect(() => {
		if (templateInfo) {
			getTemplateById(templateInfo.template_id)
				.then(response => response.data)
				.then(template => {
					setFormData({
                        code_name: template.code_name ?? '',
                        subject: template.subject ?? '',
                        notes: template.notes ?? '',
                        body: template.body ?? '',
                    });
                    editor.commands.setContent(template.body)
				})
		}
	}, [templateInfo]);


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
                                {editable ? <Typography variant='h2'>{formData.code_name}</Typography> : <CustomFilledInput label='Template Name' name='code_name' value={formData.code_name} onChange={handleChange}/>}
                                <IconButton onClick={toggleEdit}>
                                    <Pencil color='#22874E' size={16} />
                                </IconButton>
                            </Stack>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton onClick={() => templateSave(formData, templateInfo, updateTemplate, setLoading)} disabled={loading}>
                                <Check color={loading ? '#6E7772': '#22874E'} />
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

                    <CustomFilledInput label='Subject' name='subject' sx={{ width: 430, pb: 4 }} value={formData.subject} onChange={handleChange} />

                    <Box sx={{ maxWidth: 1000, pb: 4 }}>
                        <RichTextEditorBox editor={editor} />
                    </Box>

                    <CustomFilledInput label='Notes' name='notes' sx={{ width: 430, pb: 4 }} value={formData.notes} onChange={handleChange} />

                    
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
