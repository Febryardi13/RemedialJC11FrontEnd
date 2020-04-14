import React, { Component } from 'react';
import Axios from 'axios'
import { APIURL } from  '../connection/APIURL'
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import Swal from 'sweetalert2'

class Home extends Component{
    state={
        datakaryawan:[],
        modalEdit:false,
        indexedit:-1,
        idEdit:-1,
        idDelete:-1,
    }

    componentDidMount () {
        Axios.get(`${APIURL}karyawan`)
        .then((res)=>{
            console.log(res.data)
            this.setState({datakaryawan:res.data})
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    renderData = () =>{
        return this.state.datakaryawan.map((val, index)=>{
            return(
                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{val.nama}</td>
                    <td>{val.usia}</td>
                    <td>{val.pekerjaan}</td>
                    <td>
                        <div className='col-md-6'> <input onClick={()=>this.onBtnEdit(index)} type='button' className='form-control btn-success' value='Edit Data' /> </div>
                        <div className='col-md-6'> <input onClick={()=>this.btnDelete(index)} type='button' className='form-control btn-danger' value='Delete Data' /> </div>
                    </td>
                </tr>
            )
        })
    }

    renderEditData = () =>{
        return this.state.datakaryawan.map((val, index)=>{
            return (
                <div className='row'>
                    <div className='col-md-3'> <input defaultValue={val.nama} type='text' className='form-control' placeholder='Nama' ref="nama" /> </div>
                    <div className='col-md-3'> <input defaultValue={val.usia} type='number' className='form-control' placeholder='Usia' ref="usia" /> </div>
                    <div className='col-md-3'> <input defaultValue={val.pekerjaan} type='text' className='form-control' placeholder='Pekerjaan' ref="pekerjaan" /> </div>
                    <div className='col-md-3'> <input onClick={this.updateKaryawan} type='button' className='form-control btn-info' value='add Data' /> </div>
                </div>
            )
        })
    }

    onBtnEdit=(index)=>{
        var editKaryawan = this.state.datakaryawan
        console.log(editKaryawan[index].id)
        this.setState({indexedit:index, modalEdit:true, idEdit:editKaryawan[index].id})
    }

    updateKaryawan=()=>{
        var nama = this.refs.editnama.value
        var usia = this.refs.editusia.value
        var pekerjaan = this.refs.editpekerjaan.value
        var newEdit = this.state.datakaryawan
        console.log(this.state.idEdit)

        var objnew = {nama:nama, usia:usia, pekerjaan:pekerjaan}
        newEdit.splice(this.state.indexedit,1,objnew)
        Axios.put(`${APIURL}karyawan/${this.state.idEdit}`, objnew)
        this.setState({datakaryawan:newEdit, modalEdit:false, indexedit:-1, idEdit:-1})
        
        Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            onOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        }).fire({
            icon: 'success',
            title: 'Berhasil Edit'
        })
    
    }

    onBtnAdd = () =>{
        var nama      = this.refs.nama.value
        var usia      = this.refs.usia.value
        var pekerjaan = this.refs.pekerjaan.value
        
        var data = {
            nama,
            usia,
            pekerjaan
        }

        Axios.post(`${APIURL}karyawan`, data)
        .then((res)=>{
            this.setState({datakaryawan:res.data})
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Berhasil ditambahkan!'
            })
        })
        .catch((err)=>{
            console.log(err)
        })

    }

    btnDelete=(index)=>{
        Swal.fire({
            title: 'Yakin hapus ' + this.state.datakaryawan[index].nama + '?',
            text: '',
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Cancel',
            reverseButtons: true
        }).then((result)=>{
            if (result.value) {
                var hapusdata = this.state.datakaryawan
                this.setState({idDelete:hapusdata[index]["id"]})
                Swal.fire(
                    'Deleted',
                    'Berhasil dihapus!',
                    'success'
                )
                Axios.delete(`${APIURL}karyawan/${this.state.idDelete}`)
                .then(()=>{
                    Axios.get(`${APIURL}karyawan`)
                    .then(respon=>{
                        this.setState({datakaryawan:respon.data})
                    })
                    .catch(error=>{
                        console.log(error)
                    })
                })
                .catch(err=>{
                    console.log(err)
                })
                
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    'Cancelled',
                    'Tidak Jadi',
                    'error'
                )
            }
        })
    }

    render(){
        const {datakaryawan, indexedit} = this.state
        const {length} = datakaryawan
        if(length===0){
            return <div>Loading...</div>
        }
        return(
            <div>
                <h1>SOAL 1</h1>
                <div className='row'>
                    <div className='col-md-4 mb-4'>
                        <select className='form-control'>
                            <option>Filter By Pekerjaan</option>
                        </select>
                    </div>
                </div>
                {
                    indexedit===-1 ? null :
                    <Modal centered isOpen={this.state.modalEdit} toggle={()=>this.setState({modalEdit:false})}>
                        <ModalHeader>Edit {datakaryawan[indexedit].nama}</ModalHeader>
                        <ModalBody>
                            <input type="text" defaultValue={datakaryawan[indexedit].nama} ref="editnama" className="form-control mt-2"/>
                            <input type="number" defaultValue={datakaryawan[indexedit].usia} ref="editusia" className="form-control mt-2"/>
                            <input type="text" defaultValue={datakaryawan[indexedit].pekerjaan} ref="editpekerjaan" className="form-control mt-2"/>
                        </ModalBody>
                        <ModalFooter>
                            <button onClick={this.updateKaryawan} className="btn btn-success p-1">save</button>
                        </ModalFooter>
                    </Modal>
                }
                <table className='table mb-4'>
                    <thead>
                        <tr>
                            <td>No.</td>
                            <td>Nama</td>
                            <td>Usia</td>
                            <td>Pekerjaan</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderData()}
                    </tbody>
                </table>
                <div className='row'>
                    <div className='col-md-3'> <input type='text' className='form-control' placeholder='Nama' ref="nama" /> </div>
                    <div className='col-md-3'> <input type='number' className='form-control' placeholder='Usia' ref="usia" /> </div>
                    <div className='col-md-3'> <input type='text' className='form-control' placeholder='Pekerjaan' ref="pekerjaan" /> </div>
                    <div className='col-md-3'> <input onClick={this.onBtnAdd} type='button' className='form-control btn-info' value='add Data' /> </div>
                </div>
            </div>
        )
    }
}

export default Home