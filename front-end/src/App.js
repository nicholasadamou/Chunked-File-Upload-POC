import React from 'react';

import styled from 'styled-components';

import NotificationProvider from './contexts/NotifiationContext/NotificationContext';

import FileUploader from './components/FileUploader';

import './App.scss';

const Container = styled.div`
	display: grid;
	place-content: center;

	height: 100vh;
`;

const App = () => (
	<NotificationProvider>
		<Container>
			<FileUploader />
		</Container>
	</NotificationProvider>
);

export default App;
