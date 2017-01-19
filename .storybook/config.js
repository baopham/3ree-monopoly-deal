import { configure } from '@kadira/storybook'

function loadStories () {
  require('../stories/global')
}

configure(loadStories, module)
