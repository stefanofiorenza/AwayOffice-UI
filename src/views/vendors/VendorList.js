import React, {Component} from 'react';
import {
    CButton,
    CBadge,
    CCard,
    CCardBody,
    CCardHeader,
    CDataTable,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CCol,
    CForm,
    CFormGroup,
    CTextarea,
    CInput,
    CLabel,    
} from '@coreui/react';
import { Link } from 'react-router-dom';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as All from '@fortawesome/free-solid-svg-icons'
import axios from "axios";

import {connect} from 'react-redux';
import VendorService from '../../api/VendorService.js'

const getBadge = status => {
    switch (status) {
        case 'Active': return 'primary'
        case 'Resigned': return 'secondary'
        case 'Vacation': return 'secondary'
        case 'Fired': return 'danger'
        default: return 'primary'
    }
}
//const fields = ['id', 'name', 'address', 'email']


class VendorList extends Component {
    
    //constructor
    constructor(props){
        super(props)
        this.state = {
            token: '',
            vendors: [],
            vendorKeys: [],

            modalState: false,

            id: '',
            name: '',
            address: '',
            email: '',


            vendorByID: {},
            vendorID: null,
            deletedVendorByID: {},

            //for put request,
            updateVendorID: '',
            updateVendorName: '',
            updateVendorHomeAddress: '',
            updateVendorEmailAddress: '',
            updatedVendor: {},
        }
    }

    // on page load
    componentDidMount() {
        this.getVendorList();      
    }

    getVendorList = () => { 

        let headers = {
            headers:
        {
            'Authorization': 'Bearer ' + this.props.token,
            "Content-Type": "application/json",                        
        }}

        console.log(this.props.token + "  => HEREEEEE1 with REDUX");

        VendorService.getVendorList(headers)
            .then(response => {
                console.log(Object.keys(response.data._embedded.vendorDTOList[0]))
                this.setState({
                    vendors: response.data._embedded.vendorDTOList,
                    vendorKeys: Object.keys(response.data._embedded.vendorDTOList[0]).filter(item => item !== '_links')
            })})
            .catch(error => console.log(error.toString()))   
    }
                                  
    getVendorByID = (id) => {
        if(id === null){
            return null;
        }

        let headers = {
            headers:
        {
            'Authorization': 'Bearer ' + this.props.token,
            "Content-Type": "application/json",                        
        }}

        console.log(this.props.token + "  => HEREEEEE2 with REDUX")

       VendorService.getVendorById(id, headers)
        .then(response => {
                    this.setState({
                        vendorByID: response.data,
                        id: response.data.id,
                        name: response.data.name,
                        address: response.data.address,
                        email: response.data.email,                        
                    })
                    this.toggleModalState(); 
                    console.log(response);
                })
                .catch(error => console.log(error.toString()))                    
    }

    // Update Vendor Info Request
    updateVendorInfoHandler = (event) => {
        event.preventDefault();

        console.log(this.props.token + "  => HEREEEEE3 with REDUX")
        
        let updatedVendor = {
            id: this.state.id,
            name: this.state.name,
            address: this.state.address,
            email: this.state.email,
        }

        let headers = {
            headers:
        {
            'Authorization': 'Bearer ' + this.props.token,
            "Content-Type": "application/json",                        
        }}

       VendorService.updateVendorInfoHandler(updatedVendor, headers)
        .then(response => {
                alert(`Vendor with id: ${response.data.id} and name: ${response.data.name} is successfully updated!`);
                this.setState({                        
                    updatedVendor: response.data,
                    modalState: !this.state.modalState
                })
                this.getVendorList();
                console.log(response);
            })
            .catch(error => console.log(error.toString()))            
    }

    deleteVendorByID = (id) => {
        if(id === null) {
            return null;
        }
        
        let headers = {
            headers:
        {
            'Authorization': 'Bearer ' + this.props.token,
            "Content-Type": "application/json",                        
        }}

        console.log(this.props.token + "  => HEREEEEE4 with REDUX")

        VendorService.deleteVendorByID(id, headers)
        .then(response => {
                alert(`Vendor with id: ${response.data.id} and name: ${response.data.name} is successfully deleted!`);
                this.setState({
                    deletedVendorByID: response.data,
                    modalState: !this.state.modalState
                })  
                this.getVendorList(); 
                console.log(response)
            })
            .catch(error => console.log(error.toString()))            
    }

    toggleModalState = () => {
        this.setState({
            modalState: !this.state.modalState
        });
    }
     
    inputChangeHandler = (event) => {        
        this.setState({
            [event.target.name]: event.target.value,
        });
    }
    
    render () {
        return (
            
            <CCard>
                <CCardHeader>
                    Vendor List
                    <div className="card-header-actions">
                    <FontAwesomeIcon icon={All.faUserPlus} /> <Link to={"/vendor/vendorRegister"} className="card-header-action">Register New Vendor</Link>
                    </div>
                </CCardHeader>
                <CCardBody>
                    <CDataTable
                        sorter={true}
                        columnFilter={true}
                        tableFilter={true}
                        items={this.state.vendors}
                        fields={this.state.vendorKeys}
                        light
                        hover
                        striped
                        outlined
                        size="m"
                        itemsPerPage={5}
                        itemsPerPageSelect={true}
                        pagination
                        onRowClick={(row) => this.getVendorByID(row.id)}
                        scopedSlots={{
                            'status':
                                (item) => (
                                    <td>
                                        <CBadge color={getBadge(item.status)}>
                                            {item.status}
                                        </CBadge>
                                    </td>
                                )
                        }}
                    />
                </CCardBody>

                <CModal
                    show={this.state.modalState}
                    onClose={this.toggleModalState}
                    size="lg"
                >
                    <CModalHeader closeButton>
                        <CModalTitle>Vendor Details</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CForm onSubmit={this.updateVendorInfoHandler} encType="multipart/form-data" className="form-horizontal">
                            <CFormGroup row>
                                <CCol xs="3">
                                    <CFormGroup>
                                        <CLabel htmlFor="Id">Id</CLabel>
                                        <CInput id="Id" name="id" type="text" value={this.state.id} onChange={this.inputChangeHandler} required readOnly />
                                    </CFormGroup>
                                </CCol>
                                <CCol xs="5">
                                    <CFormGroup>
                                        <CLabel htmlFor="name">Name</CLabel>
                                        <CInput id="name" name="name" type="text" value={this.state.name} onChange={this.inputChangeHandler} placeholder="Enter Vendor New Name" required />
                                    </CFormGroup>
                                </CCol>                      
                            </CFormGroup>

                            <CFormGroup row>
                                <CCol xs="12" md="9">
                                    <CFormGroup >
                                        <CLabel htmlFor="status-input">Address</CLabel>
                                        <CTextarea
                                        name="address"
                                        id="address"
                                        value={this.state.address}
                                        onChange={this.inputChangeHandler}
                                        rows="2"
                                        placeholder="Enter Vendor New Address"
                                    />
                                    </CFormGroup>
                                </CCol>
                            </CFormGroup>   

                            <CFormGroup row>
                                <CCol xs="12" md="9">
                                    <CFormGroup>
                                        <CLabel htmlFor="department-input">Email</CLabel>
                                        <CInput id="email" name="email" type="email" value={this.state.email} onChange={this.inputChangeHandler} placeholder="Enter Vendor New Email" required />
                                    </CFormGroup>
                                </CCol>
                            </CFormGroup>         

                        </CForm>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="info" onClick={this.updateVendorInfoHandler}>Update Vendor</CButton>{' '}
                        <CButton color="danger" onClick={() => this.deleteVendorByID(this.state.id)}>Delete Vendor</CButton>{' '}
                        <CButton color="secondary" onClick={this.toggleModalState}>Cancel</CButton>
                    </CModalFooter>
                </CModal>
            </CCard>        
        
    )};
}

export default connect((store) => {
    return {
      token: store.token
    }
  })(VendorList);