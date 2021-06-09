import React, { useMemo, useEffect } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import axios from 'axios'
import useResponsiveFontSize from '../useResponsiveFontSize'

const useOptions = () => {
  const fontSize = useResponsiveFontSize()
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
          color: '#424770',
          letterSpacing: '0.025em',
          fontFamily: 'Source Code Pro, monospace',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#9e2146'
        }
      }
    }),
    [fontSize]
  )

  return options
}

const apiClient = axios.create({
  baseURL: 'http://flerworld.test',
  withCredentials: true
})

const CardForm = () => {
  const stripe = useStripe()
  const elements = useElements()
  const options = useOptions()
  let setupIntent = {}

  useEffect(() => {
    apiClient.get('http://flerworld.test/api/checkout/setup-intent')
      .then(response => {
        setupIntent = response.data.data.setup_intent
        console.log('setup intent:', setupIntent)
      })
      .catch(err => console.error(err))
  })

  const handleSubmit = async event => {
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    const payload = await stripe.confirmCardSetup(setupIntent.client_secret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Skin Diamond'
        }
      }
    })

    // const payload = await stripe.createPaymentMethod({
    //   type: 'card',
    //   card: elements.getElement(CardElement),
    //   billing_details: {
    //     name: 'Skin Diamond'
    //   }
    // })

    // apiClient.post('/api/checkout',
    //   {
    //     payment_method: payload.paymentMethod.id,
    //     products: [
    //       {
    //         id: 1,
    //         quantity: 1,
    //         variant: 'red'
    //       },
    //       {
    //         id: 2,
    //         quantity: 2
    //       }
    //     ],
    //     coupon_code: 'ALLEGRA666',
    //     ref_code: '123optional123'
    //   })
    //   .then(response => {
    //     console.log(response)
    //   })
    //   .catch(err => console.error(err))

    apiClient.post('/api/checkout',
      {
        payment_method: payload.setupIntent.payment_method,
        products: [
          {
            id: 1,
            quantity: 1,
            variant: 'red'
          },
          {
            id: 2,
            quantity: 1,
            subscription: true
          }
          // {
          //   id: 3,
          //   quantity: 1,
          //   subscription: true
          // }
        ],
        interval: 1
        // coupon_code: 'ALLEGRA666',
        // ref_code: 'QTuvtxYE9r'
      })
      .then(response => {
        console.log(response)
      })
      .catch(err => console.error(err))
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Card details
        <CardElement
          options={options}
        />
      </label>
      <button type='submit' disabled={!stripe}>
        Pay
      </button>
    </form>
  )
}

export default CardForm
