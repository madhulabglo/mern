import { Box, Button, Modal, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {useNavigate } from "react-router-dom";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,

};

const ShowEmployees = () => {
    const admin = localStorage.getItem("isadmin")
    const navigate = useNavigate()
    const [employee, setEmployee] = useState([])
    const [open, setOpen] = useState(false)
    const [opens, setOpens] = useState(false)
    const [datas, setDatas] = useState({})
    const [addEmployees, setAddEmployees] = useState([])
    const [success, setSuccess] = useState({message:"",successmessage:"",errormessage:""})


    const handleAddChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target
        setAddEmployees({ ...addEmployees, [name]: value })
    }

    const handleAdd = async (e) => {
        e.preventDefault()
        try {
            await fetch("http://localhost:3000/register", {
                method: "POST",
                body: JSON.stringify(addEmployees),
                headers: { "Content-Type": "application/json" }
            })
                .then((response) => response.json())
                .then((res) => {
                    setSuccess(res)
                    console.log(success,"success")
                    if(success){
                        console.log("yes")
                        setTimeout(() => {
                            setOpens(false)
                            setSuccess({successmessage:"",message:"",errormessage:""})
                        }, 2000)
                    }
                  
                })
        }
        catch (e) {
            console.log("error", e)

        }

    }

    useEffect(() => {
        fetch("http://localhost:3000/employees")
            .then((res) => res.json())
            .then((data) => setEmployee(data))

    }, [success])


    const handleEdit = (data) => {
        console.log(data, "datarrrrrrrrrrrrrrrrrrrr")
        setOpen(true)
        setDatas(data)
    }
  


    const handleChange = (e) => {
        const { name, value } = e.target
        setDatas({ ...datas, [name]: value })
    }

    const handleSubmit = () => {
        fetch(`http://localhost:3000/employees/${datas._id}`, {
            method: "PUT",
            body: JSON.stringify(datas),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((body) => {
                setSuccess(body)
                setTimeout(() => {
                    setOpen(false)
                    setSuccess({})
                }, 2000)
            })


    }

    const handleDelete = (id) => {
        fetch(`http://localhost:3000/employees/${id}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((body) => {
                setSuccess(body)
                setTimeout(() => {
                    setSuccess({})
                }, 1000)
            })

    }

    const handleAddEmployees = () => {
        setOpens(true)
    }

    const handleLogout = () => {
        localStorage.clear("isadmin")
        localStorage.clear("token")
        navigate("/")
    }

    return (
        <>


            <Button style={{ marginLeft: "80%", marginTop: "60px" }} variant="contained" onClick={handleLogout}>logout</Button>
            <center>
                <h3>employees </h3>
                <Table border={2}>
                    <TableHead>
                        <TableRow>
                            <TableCell>id</TableCell>
                            <TableCell>name</TableCell>
                            <TableCell>email</TableCell>
                            <TableCell>age</TableCell>
                            <TableCell>dob</TableCell>
                            <TableCell>city</TableCell>
                            {admin === "true" &&
                                <TableCell>actions</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employee?.map((ele, index) => {
                            return (
                                <TableRow>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{ele.name}</TableCell>
                                    <TableCell>{ele.email}</TableCell>
                                    <TableCell>{ele.age}</TableCell>
                                    <TableCell>{ele.dob.toLocaleString()}</TableCell>
                                    <TableCell>{ele.city}</TableCell>
                                    {admin === "true" &&
                                        <TableCell>
                                            <Button variant="contained" onClick={() => handleEdit(ele)}>edit</Button>&nbsp;&nbsp;
                                            <Button variant="contained" onClick={() => handleDelete(ele._id)}>delete</Button>
                                        </TableCell>}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                {admin === "true" &&
                    <>
                        <Button style={{ marginTop: "30px", marginLeft: "80%" }} onClick={handleAddEmployees} variant="contained" startIcon={<AddCircleIcon />}>Add Employees</Button>
                    </>}
                {open &&
                    <Modal open={open} onClose={() => setOpen(false)}>
                        <Box sx={{ ...style }}>
                            <center>
                                <Typography style={{ marginLeft: "100%", cursor: "pointer" }} onClick={() => setOpen(false)}>X</Typography>
                                <Typography>Edit Employee Details</Typography><br /><br />
                                <TextField variant="outlined" type="text" name="name" value={datas.name} onChange={handleChange} /><br /><br />
                                <TextField variant="outlined" type="email" name="email" value={datas.email} onChange={handleChange} /><br /><br />
                                <TextField variant="outlined" type="number" name="age" value={datas.age} onChange={handleChange} /><br /><br />
                                <TextField variant="outlined" type="date" name="dob" value={datas.dob} onChange={handleChange} /><br /><br />
                                <TextField variant="outlined" type="text" name="city" value={datas.city} onChange={handleChange} /><br /><br />
                                <Button variant="contained" onClick={handleSubmit}>Submit</Button>
                                <Typography style={{ fontSize: 16, color: "green" }}>{success.message}</Typography>
                            </center>
                        </Box>
                    </Modal>
                }

                {opens &&
                    <Modal open={opens} onClose={() => setOpens(false)}>
                        <Box sx={{ ...style }}>
                            <center>
                                <Typography style={{ marginLeft: "100%", cursor: "pointer" }} onClick={() => setOpens(false)}>X</Typography>
                                <Typography>Add Employees</Typography><br /><br />
                                <form>
                                    <TextField variant="outlined" type="text" name="name" placeholder="enter name" onChange={handleAddChange} /><br /><br />
                                    <Typography style={{ fontSize: 16, color: "red" }}>{success.message}</Typography>
                                    <TextField variant="outlined" type="email" name="email" placeholder="enter email" onChange={handleAddChange} /><br /><br />
                                    <Typography style={{ fontSize: 16, color: "red" }}>{success.message}</Typography>
                                    <TextField variant="outlined" type="text" name="password" placeholder="enter password" onChange={handleAddChange} /><br /><br />
                                    <Typography style={{ fontSize: 16, color: "red" }}>{success.message}</Typography>
                                    <TextField variant="outlined" type="number" name="age" placeholder="enter age" onChange={handleAddChange} /><br /><br />
                                    <Typography style={{ fontSize: 16, color: "red" }}>{success.message}</Typography>
                                    <TextField variant="outlined" type="date" name="dob" placeholder="enter dob" onChange={handleAddChange} /><br /><br />
                                    <Typography style={{ fontSize: 16, color: "red" }}>{success.message}</Typography>
                                    <TextField variant="outlined" type="text" name="city" placeholder="enter city name" onChange={handleAddChange} /><br /><br />
                                    <Typography style={{ fontSize: 16, color: "red" }}>{success.message}</Typography>
                                    <Button variant="contained" onClick={handleAdd}>submit</Button>
                                    <Typography style={{ fontSize: 16, color: "red" }}>{success.errormessage}</Typography>
                                    <Typography style={{ fontSize: 16, color: "green" }}>{success.successmessage}</Typography>
                                </form>

                            </center>

                        </Box>
                    </Modal>}
            </center>
        </>
    )
}
export default ShowEmployees