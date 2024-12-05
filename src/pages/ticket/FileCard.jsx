import { Box, Card, CardActions, Link, Stack, Typography } from '@mui/material';
import { Code, FileIcon, FileText, FileVideo, FolderArchive, Image } from 'lucide-react';
import humanFileSize from '../../functions/file-size-formatter';

export const FileCard = ({ file }) => {
    const icons = {
        'video/mpeg': <FileVideo size={60} color='#6e7772' strokeWidth={1}/>,
        'video/mp4': <FileVideo size={60} color='#6e7772' strokeWidth={1}/>,
        'text/html': <Code size={60} color='#6e7772' strokeWidth={1}/>,
        'text/css': <Code size={60} color='#6e7772' strokeWidth={1}/>,
        'image/gif': <Image size={60} color='#6e7772' strokeWidth={1}/>,
        'image/jpeg': <Image size={60} color='#6e7772' strokeWidth={1}/>,
        'image/png': <Image size={60} color='#6e7772' strokeWidth={1}/>,
        'text/plain': <FileText size={60} color='#6e7772' strokeWidth={1}/>,
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': <FileText size={60} color='#6e7772' strokeWidth={1}/>,
        'application/x-zip-compressed': <FolderArchive size={60} color='#6e7772' strokeWidth={1}/>,
        'application/pdf': <FileText size={60} color='#6e7772' strokeWidth={1}/>,

    }
	return (
		<Card sx={{ width: '100px' }}>
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', mt: 1, flexDirection: 'column' }}>
                {icons[file.type] ? icons[file.type] : <FileIcon size={60} color='#6e7772' strokeWidth={1} />}
                <Typography color='#6e7772' fontWeight={600}>{`.${file.name.split('.').at(-1).toUpperCase()}`}</Typography>
			</Box>

			<CardActions>
				<Stack justifyContent='space-between' direction='column' width={80}>
					<Link href={file.link} target="_blank" fontSize='0.65rem' rel="noopener">
						<Typography
							fontSize='0.65rem'
							noWrap
							sx={{
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								display: '-webkit-box',
								WebkitBoxOrient: 'vertical',
								WebkitLineClamp: 2,
								display: 'block',
							}}
						>
							{file.name}
						</Typography>
					</Link>
					<Typography fontSize='0.65rem'>{humanFileSize(file.size, true, 1)}</Typography>
				</Stack>
			</CardActions>
		</Card>
	);
};
