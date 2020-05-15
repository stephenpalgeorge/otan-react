const { useConfig } = require('../common-utils')

const { name } = useConfig()
require('./index')(name)