import { configure } from '@kadira/storybook'

function loadStories () {
  require('../stories/global')
  require('../stories/games')
  require('../stories/game')
}

configure(loadStories, module)
