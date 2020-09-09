import { useInterval } from '@react-corekit/use-interval'
import { ethers } from 'ethers'
import { BigNumber } from 'ethers/utils'
import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router'

import { FETCH_DETAILS_INTERVAL, MAX_MARKET_FEE } from '../../../common/constants'
import { useCheckContractExists, useContracts, useCpk, useMarketMakerData } from '../../../hooks'
import { useConnectedWeb3Context } from '../../../hooks/connectedWeb3'
import { useGelatoSubmittedTasks } from '../../../hooks/useGelatoSubmittedTasks'
import { MarketBuyPage, MarketDetailsPage, MarketPoolLiquidityPage, MarketSellPage } from '../../../pages'
import { getLogger } from '../../../util/logger'
import { isAddress } from '../../../util/tools'
import { ThreeBoxComments } from '../../comments'
import { SectionTitle } from '../../common'
import { InlineLoading } from '../../loading'
import { MarketNotFound } from '../sections/market_not_found'

const logger = getLogger('Market::Routes')

interface RouteParams {
  address: string
}

interface Props {
  marketMakerAddress: string
}

// Add Gelato Condition Data Fetching here
const MarketValidation: React.FC<Props> = (props: Props) => {
  const context = useConnectedWeb3Context()
  const { account, library: provider } = context
  const cpk = useCpk()

  const { marketMakerAddress } = props

  // Validate contract REALLY exists
  const contractExists = useCheckContractExists(marketMakerAddress, context)
  const { fetchData, marketMakerData } = useMarketMakerData(marketMakerAddress.toLowerCase())

  const cpkAddress = '0x9671dC03ec719ff66C561e2dc73411b041548B73'

  useGelatoSubmittedTasks(cpkAddress, marketMakerAddress, context)

  // useInterval(fetchData, FETCH_DETAILS_INTERVAL)
  if (!contractExists) {
    logger.log(`Market address not found`)
    return <MarketNotFound />
  }

  if (!marketMakerData) {
    return <InlineLoading />
  }
  const { fee } = marketMakerData

  // Validate Markets with wrong FEE
  const feeBN = ethers.utils.parseEther('' + MAX_MARKET_FEE / Math.pow(10, 2))
  const zeroBN = new BigNumber(0)
  if (!(fee.gte(zeroBN) && fee.lte(feeBN))) {
    logger.log(`Market was not created with this app (different fee)`)
    return <SectionTitle title={'Invalid market'} />
  }

  return (
    <>
      <MarketDetailsPage {...props} marketMakerData={marketMakerData} />
      <ThreeBoxComments threadName={marketMakerAddress} />
    </>
  )
}

const MarketRoutes = (props: RouteComponentProps<RouteParams>) => {
  const marketMakerAddress = props.match.params.address

  if (!isAddress(marketMakerAddress)) {
    logger.log(`Contract address not valid`)
    return <Redirect to="/" />
  }

  return <MarketValidation marketMakerAddress={marketMakerAddress} />
}

export { MarketRoutes }
