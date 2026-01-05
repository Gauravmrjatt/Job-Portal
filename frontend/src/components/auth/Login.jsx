import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading,user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }
    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])
    return (
    <div>
        <Navbar />
        <div className='flex items-center justify-center min-h-screen px-4 py-8'>
            <div className='w-full max-w-md mx-auto'>
                <form onSubmit={submitHandler} className='w-full border border-gray-200 rounded-md p-6 shadow-lg bg-white'>
                    <h1 className='font-bold text-xl mb-6 text-center'>Login</h1>
                    
                    <div className='mb-4'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="Enter your email"
                            className="mt-1"
                        />
                    </div>

                    <div className='mb-4'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Enter your password"
                            className="mt-1"
                        />
                    </div>
                    
                    {/* Role Selection */}
                    <div className='mb-6'>
                        <Label className="block mb-2">Login as</Label>
                        <RadioGroup className="flex flex-col sm:flex-row gap-4">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer w-4 h-4"
                                    id="student"
                                />
                                <Label htmlFor="student" className="cursor-pointer">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer w-4 h-4"
                                    id="recruiter"
                                />
                                <Label htmlFor="recruiter" className="cursor-pointer">Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    
                    {/* Submit Button */}
                    {loading ? (
                        <Button disabled className="w-full mb-4 py-2">
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> 
                            Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full mb-4 py-2">
                            Login
                        </Button>
                    )}
                    
                    {/* Signup Link */}
                    <div className='text-center'>
                        <span className='text-sm text-gray-600'>
                            Don't have an account?{' '}
                            <Link to="/signup" className='text-blue-600 hover:text-blue-800 font-medium'>
                                Sign Up
                            </Link>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    </div>
)
}

export default Login