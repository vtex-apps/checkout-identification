import classNames from 'classnames'
import React, { useState, useEffect } from 'react'
import { useLazyQuery } from 'react-apollo'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { IconCheck, Input, Button, Divider, Spinner } from 'vtex.styleguide'
import { useChildBlock, ExtensionPoint, useRuntime } from 'vtex.render-runtime'
import { OrderProfile } from 'vtex.order-profile'
import ProfileQuery from 'vtex.checkout-resources/QueryProfile'
import {
  CheckoutProfile,
  QueryCheckoutProfileArgs,
} from 'vtex.checkout-graphql'

import IconLock from './icons/IconLock'
import styles from './Identification.css'

const messages = defineMessages({
  title: {
    id: 'store/checkout-identification-presentation',
  },
  secure: {
    id: 'store/checkout-identification-secure-badge-title',
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
  const { setOrderProfile } = OrderProfile.useOrderProfile()

  const [email, setEmail] = useState('')
  const [showError, setShowError] = useState(false)
  const [loading, setLoading] = useState(false)
  const hasLogoBlock = !!useChildBlock({ id: 'logo' })
  const { navigate } = useRuntime()
  const intl = useIntl()

  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setEmail(evt.target.value)
  }

  const emailValid = EMAIL_REGEX.test(email)

  const handleSubmit = () => {
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

    if (data.checkoutProfile?.userProfileId != null) {
      setOrderProfile(data.checkoutProfile?.userProfile?.email).then(() => {
        if (!isCurrent) {
          return
        }

        setLoading(false)

        navigate({ page: 'store.checkout.container' })
      })
    } else {
      setLoading(false)

      navigate({ page: 'store.checkout.container' })
    }

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
      <div className="flex justify-between items-center">
        <ExtensionPoint id={hasLogoBlock ? 'logo' : 'image'} />
      </div>

      <span className="f4 dib mt7">
        <FormattedMessage {...messages.title} />
      </span>

      <div className="mt4 mb7 flex items-center">
        <IconLock />{' '}
        <span className="c-muted-1 f6 b dib ml3">
          <FormattedMessage {...messages.secure} />
        </span>
      </div>

      <Input
        label={<FormattedMessage {...messages.emailLabel} />}
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
