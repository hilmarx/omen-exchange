import React from 'react'

import { MarketMakerData, TaskReceipt } from '../../../../util/types'

import { MarketPoolLiquidity } from './market_pool_liquidity'

interface Props {
  marketMakerData: MarketMakerData
  gelatoTask?: {
    submittedTaskReceipt: TaskReceipt
    withdrawDate: Date
  }
}

const MarketPoolLiquidityContainer: React.FC<Props> = (props: Props) => {
  const { gelatoTask, marketMakerData } = props

  return <MarketPoolLiquidity gelatoTask={gelatoTask} marketMakerData={marketMakerData} />
}

export { MarketPoolLiquidityContainer }
