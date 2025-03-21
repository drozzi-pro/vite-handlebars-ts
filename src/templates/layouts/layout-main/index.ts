import '@layouts/base/header'
import '@layouts/base/footer'
import '@shared/logo'

import { app } from "@src/common";

document.addEventListener('DOMContentLoaded', () => {
  app.initDependencies()
})