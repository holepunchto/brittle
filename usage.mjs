import esc from 'ansi-escapes'
import { bgYellowBright, italic, bgYellow, underline } from 'colorette'
export default `
${bgYellow('    ')}
${bgYellowBright(' 🥜 ')} ${underline(('Brittle'))}
${bgYellow('    ')}
${bgYellow('    ')}  brittle [flags] [<files>]
${bgYellow('    ')}
${bgYellow('    ')}  --help | -h         Show this help
${bgYellow('    ')}  --watch | -w        Rerun tests when a file changes
${bgYellow('    ')}  --reporter | -R     Set test reporter: ${italic('tap, spec, dot')}
${bgYellow('    ')}  --no-cov            Turn off coverage
${bgYellow('    ')}  --100               Fail if coverage is not 100%  
${bgYellow('    ')}  --90                Fail if coverage is not 90%
${bgYellow('    ')}  --85                Fail if coverage is not 85%
${bgYellow('    ')}  --cov-report        Set coverage reporter: 
${bgYellow('    ')}                      ${italic('text, html, text-summary...')}
${bgYellow('    ')} 
${bgYellowBright(' 🥜 ')}  --cov-help          Show advanced coverage options   
${bgYellow('    ')}
${bgYellow('    ')}

`

export const covUsage = `
${bgYellow('    ')}
${bgYellowBright(' 🥜 ')} ${underline(('Brittle'))}
${bgYellow('    ')}
${bgYellow('    ')}  ${italic('Additional and all coverage options')}
${bgYellow('    ')}
${bgYellow('    ')}  --lines <n>         Fail if line coverage doesn't meet <n>
${bgYellow('    ')}  --functions <n>     Fail if function coverage doesn't meet <n>
${bgYellow('    ')}  --statements <n>    Fail if statement coverage doesn't meet <n>
${bgYellow('    ')}  --branches <n>      Fail if branch coverage doesn't meet <n>
${bgYellow('    ')}  --cov-all           Apply coverage to all instead of only runtime-loaded files
${bgYellow('    ')}  --cov-exclude       Exclude files from coverage report
${bgYellow('    ')}  --cov-include       Include files in coverage report
${bgYellow('    ')}  --cov-dir           Set the coverage output directory: ${italic('<project>/coverage')}
${bgYellow('    ')}  --no-cov-clean      Do not wipe the coverage folder before each run                        
${bgYellow('    ')}  --cov-report        Set coverage reporter: 
${bgYellow('    ')}                      ${italic('text, html, text-summary...')}
${bgYellow('    ')}  --100               Fail if coverage is not 100%  
${bgYellow('    ')}  --90                Fail if coverage is not 90%
${bgYellow('    ')}  --85                Fail if coverage is not 85%
${bgYellow('    ')}  --no-cov            Turn off coverage
${bgYellow('    ')}
${bgYellowBright(' 🥜 ')}  ${italic('For more coverage reporters see:')}
${bgYellow('    ')}  ${esc.link('https://istanbul.js.org/docs/advanced/alternative-reporters', 'https://istanbul.js.org/docs/advanced/alternative-reporters')}
${bgYellow('    ')}
${bgYellowBright(' 🥜 ')}  ${italic('For more information & configuration capabalities see:')}
${bgYellow('    ')}  ${esc.link('https://github.com/bcoe/c8', 'https://github.com/bcoe/c8')}
${bgYellow('    ')}

`