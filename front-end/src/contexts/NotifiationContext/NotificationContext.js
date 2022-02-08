import React, { Component, createContext } from 'react';
import ReactDOM from 'react-dom';

import './index.scss';

import { ToastNotification, InlineNotification } from 'carbon-components-react';

export const NotificationContext = createContext();

class NotificationProvider extends Component {
	constructor(props) {
		super(props);

		this.state = {
			visible: false,
			hideCloseButton: true,
			lowContrast: false,
			isDismissable: false,
			timeout: 3000,
			kind: 'error',
			subtitle: '',
			caption: '',
			statusIconDescription: '',
			style: {},
			className: '',
			title: '',
			inline: false,
			actionButton: <></>,
			container: document.body,
		};
	}

	componentDidMount() {
		document.addEventListener('click', this.handleClickOutside, true);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleClickOutside, true);
	}

	handleClickOutside = (event) => {
		const { isDismissable } = this.state;

		if (!isDismissable) return;

		const domNode = ReactDOM.findDOMNode(this);

		if (!domNode || !domNode.contains(event.target)) {
			this.setState({
				visible: false
			}, () => {
				this.reset();
			});
		}
	}

	showNotification = (notification) => {
		const {
			error,
			success,
			kind,
			subtitle,
			caption,
			statusIconDescription,
			style,
			className,
			timeout,
			hideCloseButton,
			lowContrast,
			inline,
			container,
			title,
			actionButton,
			isDismissable,
		} = notification;

		this.setState({
			visible: (error !== undefined) || (success !== undefined),
			isDismissable: isDismissable === undefined ? this.state.isDismissable : isDismissable,
			actionButton: actionButton === undefined ? this.state.actionButton : actionButton,
			title: title === undefined ? this.state.title : title,
			hideCloseButton: hideCloseButton === undefined ? this.state.hideCloseButton : hideCloseButton,
			lowContrast: lowContrast === undefined ? this.state.lowContrast : lowContrast,
			timeout: timeout === undefined ? this.state.timeout : timeout,
			kind: kind === undefined ? this.state.kind : kind,
			subtitle: subtitle === undefined ? this.state.subtitle : subtitle,
			caption: caption === undefined ? this.state.caption : caption,
			statusIconDescription: statusIconDescription === undefined ? this.state.statusIconDescription : statusIconDescription,
			style: style === undefined ? this.state.style : style,
			className: className === undefined ? this.state.className : className,
			inline: inline === undefined ? this.state.inline : inline,
			container: container === undefined ? this.state.container : container,
		}, () => {

			setTimeout(() => {
				this.reset();
			}, this.state.timeout);

		});
	}

	onCloseButtonClick = () => {
		this.reset();
	}

	reset = () => {
		this.setState({
			visible: false,
			hideCloseButton: true,
			lowContrast: false,
			isDismissable: false,
			timeout: 3000,
			kind: 'error',
			subtitle: '',
			caption: '',
			statusIconDescription: '',
			style: {},
			className: '',
			title: '',
			inline: false,
			actionButton: <></>,
			container: document.body,
		})
	}

	render() {
		const {
			visible,
			kind,
			subtitle,
			caption,
			statusIconDescription,
			timeout,
			style,
			className,
			hideCloseButton,
			lowContrast,
			inline,
			container,
			actionButton
		} = this.state;

		const { children } = this.props;

		let title = '';

		if (this.state.title.length === 0) {
			if (kind === 'warning' || kind === 'warning-alt') {
				title = 'Warning';
			} else if (kind === 'success') {
				title = 'Success';
			} else if (kind === 'error') {
				title = 'Error';
			} else if (kind === 'info' || kind === 'info-square') {
				title = '';
			}
		} else {
			title = this.state.title;
		}

		return (
			<NotificationContext.Provider
				value={{
					...this.state,
					showNotification: this.showNotification
				}}
			>
				<>
					{
						(visible) && (
							ReactDOM.createPortal(
								inline ?
									<InlineNotification
										kind={kind}
										title={title}
										subtitle={subtitle}
										caption={caption}
										statusIconDescription={statusIconDescription}
										hideCloseButton={hideCloseButton}
										lowContrast={lowContrast}
										actions={actionButton}
										timeout={timeout}
										style={{
											...style
										}}
										className={`${className} animate__animated animate__bounceInUp`}
										onCloseButtonClick={this.onCloseButtonClick}
									/>
									:
									<ToastNotification
										kind={kind}
										title={title}
										subtitle={subtitle}
										caption={caption}
										statusIconDescription={statusIconDescription}
										hideCloseButton={hideCloseButton}
										lowContrast={lowContrast}
										timeout={timeout}
										style={{
											...style
										}}
										className={`${className} notification animate__animated animate__bounceInUp`}
										onCloseButtonClick={this.onCloseButtonClick}
									/>,
								container
							)
						)
					}
				</>
				{children}
			</NotificationContext.Provider>
		)
	}
}


/**


 import React, { Component, createContext } from 'react';
import ReactDOM from 'react-dom';

import './index.scss';

import { ToastNotification, InlineNotification } from 'carbon-components-react'

export const NotificationContext = createContext();

const NotificationProvider = (props) => {
	const { children } = props;

	const [error, setError] = React.useState(false);
	const [success, setSuccess] = React.useState(false);
	const [hideCloseButton, shouldHideCloseButton] = React.useState(true);
	const [lowContrast, isLowContrast] = React.useState(false);
	const [timeout, setTimeout] = React.useState(3000);
	const [kind, setKind] = React.useState('error');
	const [subtitle, setSubtitle] = React.useState('');
	const [caption, setCaption] = React.useState('');
	const [statusIconDescription, setStatusIconDescription] = React.useState('');
	const [style, setStyle] = React.useState({});
	const [className, setClassName] = React.useState('');
	const [title, setTitle] = React.useState('');
	const [actionButton, setActionButton] = React.useState(<></>);
	const [container, setContainer] = React.useState(document.body);
	const [canDismiss, isDismissable] = React.useState(false);
	const [inline, isInline] = React.useState(true);

	let notificationTitle = '';

	if (title.length === 0) {
		if (kind === 'warning' || kind === 'warning-alt') {
			notificationTitle = 'Warning';
		} else if (kind === 'success') {
			notificationTitle = 'Success';
		} else if (kind === 'error') {
			notificationTitle = 'Error';
		} else if (kind === 'info' || kind === 'info-square') {
			notificationTitle = '';
		}
	} else {
		notificationTitle = title;
	}

	const showNotification = (notification) => {
		setError(notification.error === undefined ? error : notification.error);
		setSuccess(notification.success === undefined ? success : notification.success);
		setKind(notification.kind === undefined ? kind : notification.kind);
		setSubtitle(notification.subtitle === undefined ? subtitle : notification.subtitle);
		setCaption(notification.caption === undefined ? caption : notification.caption);
		setStatusIconDescription(notification.statusIconDescription ? statusIconDescription : notification.statusIconDescription);
		setStyle(notification.style === undefined ? style : notification.style);
		setClassName(notification.className ? className : notification.className);
		setTimeout(notification.timeout === undefined ? timeout : notification.timeout);
		shouldHideCloseButton(notification.hideCloseButton === undefined ? hideCloseButton : notification.hideCloseButton);
		isLowContrast(notification.lowContrast === undefined ? lowContrast : notification.lowContrast);
		isInline(notification.inline === undefined ? inline : notification.inline);
		setContainer(notification.container === undefined ? container : notification.container);
		setTitle(notification.title === undefined ? title : notification.title);
		isDismissable(notification.canDismiss === undefined ? canDismiss : notification.canDismiss);
		setActionButton(notification.actionButton === undefined ? actionButton : notification.actionButton);

		setTimeout(() => {
			reset();
		}, timeout);
	}

	const reset = () => {
		setError(false);
		setSuccess(false);
		setKind('error');
		setSubtitle('');
		setCaption('');
		setStatusIconDescription('');
		setStyle({});
		setClassName('');
		setTimeout(3000);
		shouldHideCloseButton(true);
		isLowContrast(false);
		isInline(false);
		setContainer(document.body);
		setTitle('');
		isDismissable(false);
		setActionButton(<></>);
	}

	const onCloseButtonClick = () => {
		reset();
	}

	return (
		<NotificationContext.Provider
			value={{
				error,
				success,
				kind,
				subtitle,
				caption,
				statusIconDescription,
				style,
				className,
				timeout,
				hideCloseButton,
				lowContrast,
				inline,
				container,
				title,
				actionButton,
				canDismiss,
				showNotification,
			}}
		>
			<>
				{
					(error || success) && (
						ReactDOM.createPortal(
							inline ?
									<InlineNotification
										kind={kind}
										title={notificationTitle}
										subtitle={subtitle}
										caption={caption}
										statusIconDescription={statusIconDescription}
										hideCloseButton={hideCloseButton}
										lowContrast={lowContrast}
										actions={actionButton}
										timeout={timeout}
										style={{
											...style
										}}
										className={`${className} animate__animated animate__bounceInUp`}
										onCloseButtonClick={onCloseButtonClick}
									/>
								:
									<ToastNotification
										kind={kind}
										title={notificationTitle}
										subtitle={subtitle}
										caption={caption}
										statusIconDescription={statusIconDescription}
										hideCloseButton={hideCloseButton}
										lowContrast={lowContrast}
										timeout={timeout}
										style={{
											...style
										}}
										className={`${className} notification animate__animated animate__bounceInUp`}
										onCloseButtonClick={onCloseButtonClick}
									/>,
							container
						)
					)
				}
			</>
			{children}
		</NotificationContext.Provider>
	)
 }

export default NotificationProvider;


 */

export default NotificationProvider;
