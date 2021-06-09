import React from 'react'
import axios from 'axios'

import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { BrowserRouter } from 'react-router-dom'

import CardForm from './components/CardForm'

import './styles.css'

const stripePromise = loadStripe('pk_test_51IeH8OEnlEj35iNXdl4hwDVvyJc1AJR5zgSkBVWaez9QkGo4lZhCGLa1tmEFqi63mMqk2Pzb23KmvDkrdW0295rl00krUVGHob')

const apiClient = axios.create({
  baseURL: 'http://flerworld.test',
  withCredentials: true
})

function login () {
  apiClient.post('/api/login',
    {
      email: 'john@example.com',
      password: 'password'
    })
    .then(function (response) {
      console.log(response)
    })
}

function logout () {
  apiClient.post('/api/logout')
    .then(function (response) {
      console.log(response)
    })
}

function getUser () {
  apiClient.get('/api/user')
    .then(function (response) {
      console.log(response.data.data)
    })
}

function App () {
  return (
    <BrowserRouter>
      <button onClick={() => login()}>Login</button>
      <button onClick={() => getUser()}>Get user</button>
      <button onClick={() => logout()}>Logout</button>
      <Elements stripe={stripePromise}>
        <CardForm />
      </Elements>
    </BrowserRouter>
  )
}

export default App
