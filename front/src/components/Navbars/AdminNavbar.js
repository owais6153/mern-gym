import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";

import "../../assets/scss/AdminNavbar.scss";
import anime3 from '../../assets/img/anime3.png';

import { useNavigate } from "react-router-dom";
import { userLogoutAction } from "../../redux/actions/userAction";
import { connect } from "react-redux"

// reactstrap components
import {
	Collapse,
	Input,
	NavbarBrand,
	Navbar,
	Nav,
	Container,
	Modal,
	NavbarToggler,
	ModalHeader,
	UncontrolledDropdown, 
	DropdownToggle, 
	DropdownMenu, 
	DropdownItem 
} from "reactstrap";

function AdminNavbar(props) {
  const navigate = useNavigate()

	const [collapseOpen, setcollapseOpen] = React.useState(false);
	const [modalSearch, setmodalSearch] = React.useState(false);
	const [color, setcolor] = React.useState("navbar-transparent");
	React.useEffect(() => {
		window.addEventListener("resize", updateColor);
		// Specify how to clean up after this effect:
		return function cleanup() {
			window.removeEventListener("resize", updateColor);
		};
	});

	// function that adds color white/transparent to the navbar on resize (this is for the collapse)
	const updateColor = () => {
		if (window.innerWidth < 993 && collapseOpen) {
			setcolor("bg-white");
		} else {
			setcolor("navbar-transparent");
		}
	};

	// this function opens and closes the collapse on small devices
	const toggleCollapse = () => {
		if (collapseOpen) {
			setcolor("navbar-transparent");
		} else {
			setcolor("bg-white");
		}
		setcollapseOpen(!collapseOpen);
	};

	// this function is to open the Search modal
	const toggleModalSearch = () => {
		setmodalSearch(!modalSearch);
	};

  const logoutFunc = ()=>{
    props.userLogoutAction().then(response => {
      navigate('/');
    });
  }
	return (
	<>
		<Navbar className={classNames("navbar-absolute")} expand="lg">
			<Container fluid>
				<div className="navbar-wrapper">
					<div
						className={classNames("navbar-toggle d-inline", {
							toggled: props.sidebarOpened
						})}
					>
						<NavbarToggler onClick={props.toggleSidebar}>
							<span className="navbar-toggler-bar bar1" />
							<span className="navbar-toggler-bar bar2" />
							<span className="navbar-toggler-bar bar3" />
						</NavbarToggler>
					</div>

					<NavbarBrand href="#pablo" onClick={(e) => e.preventDefault()}>
						{/* {props.brandText} */}
					</NavbarBrand>
				</div>

				<NavbarToggler onClick={toggleCollapse} className="d-none d-md-block d-lg-none">
					<span className="navbar-toggler-bar navbar-kebab" />
					<span className="navbar-toggler-bar navbar-kebab" />
					<span className="navbar-toggler-bar navbar-kebab" />
				</NavbarToggler>

				<Collapse navbar isOpen={collapseOpen} className="d-flex justify-content-end d-none d-md-block d-lg-none">
					<Nav className="ml-auto my-md-4" navbar>
						
						<li className="separator d-lg-none d-none d-md-block d-lg-none" />
						
						<UncontrolledDropdown className="login-dropdown d-none d-md-block d-lg-none">
							<DropdownToggle data-toggle="dropdown">
								<div className="shortInfo">
									<div className="titles">
										<h5>Administrator</h5>
										<h4>{props.fullName}</h4>
										<h6>Edit Account Info</h6>
									</div>

									<div className="userImg">
										<figure>
											<img src={anime3} alt="..." />
										</figure>
									</div>
								</div>
							</DropdownToggle>
							{/* <DropdownMenu className="dropdown-black">
								<DropdownItem onClick={() => logoutFunc()}>Logout</DropdownItem>
							</DropdownMenu> */}
						</UncontrolledDropdown>
					</Nav>
				</Collapse>
			</Container>
		</Navbar>

		<Modal
			modalClassName="modal-search"
			isOpen={modalSearch}
			toggle={toggleModalSearch}
		>
			<ModalHeader>
				<Input placeholder="SEARCH" type="text" />
				<button
					aria-label="Close"
					className="close"
					onClick={toggleModalSearch}
				>
					<i className="tim-icons icon-simple-remove" />
				</button>
			</ModalHeader>
		</Modal>
	</>
	);
}

const mapStateToProps = state => ({
  fullName: state.userReducer.fullName,
  email: state.userReducer.email,
  profile_image: state.userReducer.profile_image,
})

const mapDispatchToProps = (dispatch) => ({
  userLogoutAction: (data, navigate) => dispatch( userLogoutAction(data, navigate) ),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminNavbar)