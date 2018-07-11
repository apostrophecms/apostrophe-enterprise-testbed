module.exports = {
  addFields: [
    {
      name: 'dealerRecommendedConfig',
      type: 'checkboxes',
      label: 'Recommended Dealer config',
      choices: [
        {
          label: 'Is certified',
          value: 'isCertified'
        },
        {
          label: 'Is prefered',
          value: 'isPreferredDealer'
        },
        {
          label: 'Best chance in stock',
          value: 'isBestChanceInStock'
        },
        {
          label: 'Has a network',
          value: 'networkName'
        }
      ]
    }
  ]
}