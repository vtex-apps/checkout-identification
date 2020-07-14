import classNames from 'classnames'
import React, { useState, useEffect, useRef } from 'react'
import { useLazyQuery } from 'react-apollo'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import {
  IconCheck,
  IconArrowBack,
  Input,
  Button,
  Divider,
  Spinner,
} from 'vtex.styleguide'
import { useChildBlock, ExtensionPoint, useRuntime } from 'vtex.render-runtime'
import { useOrderProfile } from 'vtex.order-profile/OrderProfile'
import ProfileQuery from 'vtex.checkout-resources/QueryProfile'
import {
  CheckoutProfile,
  QueryCheckoutProfileArgs,
} from 'vtex.checkout-graphql'

import styles from './Identification.css'

const messages = defineMessages({
  backToStoreLabel: {
    id: 'store/checkout-identification-back-to-store-label',
  },
  emailLabel: {
    id: 'store/checkout-identification-email-label',
  },
  continueButtonLabel: {
    id: 'store/checkout-identification-continue-button-label',
  },
  benefitsLabel: {
    id: 'store/checkout-identification-benefits-label',
  },
  savedAddressesMessage: {
    id: 'store/checkout-identification-saved-addresses-message',
  },
  giftCardsMessage: {
    id: 'store/checkout-identification-gift-cards-message',
  },
  orderUpdatesMessage: {
    id: 'store/checkout-identification-order-updates-message',
  },
  invalidEmail: {
    id: 'store/checkout-identification-invalid-email',
  },
})

const EMAIL_REGEX = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/

const Identification: React.FC = () => {
  const [queryProfile, { data, loading: queryLoading }] = useLazyQuery<
    { checkoutProfile: CheckoutProfile },
    QueryCheckoutProfileArgs
  >(ProfileQuery)
  const { setOrderProfile } = useOrderProfile()

  const [email, setEmail] = useState('')
  const emailRef = useRef(email)
  const [showError, setShowError] = useState(false)
  const [loading, setLoading] = useState(false)
  const hasLogoBlock = !!useChildBlock({ id: 'logo' })
  const { navigate } = useRuntime()
  const intl = useIntl()

  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setEmail(evt.target.value)
  }

  useEffect(() => {
    emailRef.current = email
  }, [email])

  const emailValid = EMAIL_REGEX.test(email)

  const handleBackToStoreClick = () => {
    navigate({ page: 'store.checkout.cart' })
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = evt => {
    evt.preventDefault()

    if (!email || !emailValid) {
      return
    }

    setLoading(true)
    queryProfile({ variables: { email } })
  }

  const handleEmailBlur = () => {
    setShowError(!emailValid)
  }

  useEffect(() => {
    if (!data || queryLoading) {
      return
    }

    let isCurrent = true

    setOrderProfile({
      email: emailRef.current,
    }).then(() => {
      if (!isCurrent) {
        return
      }

      setLoading(false)

      navigate({ page: 'store.checkout.order-form' })
    })

    return () => {
      isCurrent = false
    }
  }, [data, navigate, queryLoading, setOrderProfile])

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className={classNames(styles.box, 'ba-ns br3 b--muted-4 pa4 pa8-ns')}
    >
      <div className={classNames(styles.buttonContainer, 'mb7')}>
        <Button
          size="small"
          variation="tertiary"
          noUpperCase
          neutral
          onClick={handleBackToStoreClick}
        >
          <span className="mr3">
            <IconArrowBack />
          </span>
          <span className="ml1">
            {intl.formatMessage(messages.backToStoreLabel)}
          </span>
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <ExtensionPoint id={hasLogoBlock ? 'logo' : 'image'} />
      </div>

      <span className="f4 dib mt7 mb5">
        <FormattedMessage {...messages.emailLabel} />
      </span>

      <Input
        autoComplete="email"
        type="email"
        value={email}
        onBlur={handleEmailBlur}
        onChange={handleEmailChange}
        errorMessage={showError && intl.formatMessage(messages.invalidEmail)}
      />

      <div className="flex mt5">
        <Button block disabled={loading} type="submit">
          {loading ? (
            <Spinner size={24} />
          ) : (
            <FormattedMessage {...messages.continueButtonLabel} />
          )}
        </Button>
      </div>

      <div className="mv7">
        <Divider />
      </div>

      <div>
        <span className="c-muted-1 f5 b">
          <FormattedMessage {...messages.benefitsLabel} />
        </span>
        <ol className="list ma0 pa0 f5 c-muted-1">
          <li className="mt3">
            <IconCheck />{' '}
            <FormattedMessage {...messages.savedAddressesMessage} />
          </li>
          <li className="mt2">
            <IconCheck /> <FormattedMessage {...messages.giftCardsMessage} />
          </li>
          <li className="mt2">
            <IconCheck /> <FormattedMessage {...messages.orderUpdatesMessage} />
          </li>
        </ol>
      </div>
    </form>
  )
}

export default Identification
