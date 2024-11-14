import { Box, Stack, Typography } from '@mui/material';
import { CustomFilledInput } from '../../../components/custom-input';
import { CircularButton } from '../../../components/sidebar';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useTemplateBackend } from '../../../hooks/useTemplateBackend';
import { RichTextEditorBox } from '../../../components/rich-text-editor';
import { useEffect, useState } from 'react';
import { create } from '@mui/material/styles/createTransitions';

export const AddTemplate = ({ handleCreated, handleEdited, editTemplate }) => {
    const [isFormValid, setIsFormValid] = useState(false);
    const { updateTemplate, createTemplate } = useTemplateBackend();
    const [formData, setFormData] = useState({
        template_name: '',
        subject: '',
        body: '',
        notes: '', 
    })

    const validateTemplate = () => {
        return formData.template_name && formData.subject && formData.body
    }

    useEffect(() => {
        if(editTemplate) {
            setFormData({
                template_name: editTemplate.template_name,
                subject: editTemplate.subject,
                body: editTemplate.body,
                notes: editTemplate.notes,
            })
            editor.commands.setContent(editTemplate.body)
        }
    }, [editTemplate])
	
    const handleChange = (entry) => {
		console.log(formData);
		setFormData({
			...formData,
			[entry.target.name]: entry.target.value,
		});
	};

	const editorChange = () => {
		setFormData({
			...formData,
			['body']: editor.getHTML(),
		});
	};

    const handleAction = () => {
        if(editTemplate) {
			// formData['body'] = editor.getHTML();
			try {
				var updates = {...editTemplate}
				Object.entries(formData).forEach((update) => {
					updates[update[0]] = update[1];
				});
				updateTemplate(updates).then(res => {
					handleEdited();
				})
				.catch(err => console.error(err))
			} catch (error) {
				console.error(error)
			}
        } else {
			try {
				// formData['body'] = editor.getHTML();
				createTemplate(formData).then(res => {
					handleCreated();
				})
				.catch(err => console.error(err))
			} catch (error) {
				console.error(error)
			}
        }
    }

    const editor = useEditor({
		extensions: [StarterKit],
		content: formData?.body,
		onUpdate({editor}) {
			setFormData(p => ({
				...p,
				body: editor.getHTML()
			}))
			console.log(editor.getHTML())
		}
	});

    useEffect(() => {
		const isValid = validateTemplate();
		setIsFormValid(isValid);
		console.log(formData)
	}, [formData]);


	return (
		<>
			<Typography variant='h1' sx={{ mb: 1.5 }}>
				{editTemplate ? 'Edit template' : 'Add new template'}
			</Typography>

			<Typography variant='subtitle2'>
				{editTemplate ? 'Edit template information.' : 'Please fill out the following information for the new template.'}
			</Typography>

			<Box
				sx={{
					background: '#FFF',
					m: 4,
					p: 4,
					pt: 3,
					borderRadius: '12px',
					textAlign: 'left',
				}}
			>
				<Typography variant='h4' sx={{ fontWeight: 600, mb: 2 }}>
					Required information
				</Typography>

				<CustomFilledInput 
                    label='Template Name' 
                    onChange={handleChange} 
                    value={formData?.template_name} 
                    name='template_name' 
                    fullWidth 
                    mb={2} 
                />

				<CustomFilledInput
					label='Email Subject'
					onChange={handleChange}
					value={formData?.subject}
					name='subject'
					mb={2}
					fullWidth
				/>

                <Typography variant='subtitle1' sx={{ fontWeight: 600, mb: 2 }}>
					Email Body:
				</Typography>

                <Box sx={{ maxWidth: 410.8, pb: 4 }}>
                    <RichTextEditorBox editor={editor} />
                </Box>


				<Typography variant='h4' sx={{ fontWeight: 600, mb: 2 }}>
					Optional information
				</Typography>

                <CustomFilledInput 
                    label='Internal Notes' 
                    onChange={handleChange} 
                    value={formData?.notes} 
                    name='notes' 
                    fullWidth 
                    mb={2} 
                />


			</Box>

			<Stack
				direction='row'
				// spacing={1.5}
				sx={{ justifyContent: 'center' }}
			>
				<CircularButton 
                    sx={{ py: 2, px: 6 }} 
                    onClick={handleAction} 
                    disabled={!isFormValid}
                >
					{editTemplate ? 'Edit' : 'Create'} template
				</CircularButton>
			</Stack>
		</>
	);
};
