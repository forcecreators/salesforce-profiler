/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable prettier/prettier */
/* eslint-disable prefer-template */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable max-classes-per-file */

import React from 'react';
import loader from '@monaco-editor/loader';

import Workspace from './workspace';
import ProcessModal from './ProcessModal';
import VerticalNav from './VerticalNav';
import constants, { Argument } from '../constants';
import ApexLogMetadata from '../../main/profiler/ApexLogMetadata';

class SummaryProps {
  logPath: string;
}

export default class RawLog extends React.Component<SummaryProps> {
  public componentDidMount() {
    loader.init().then((monaco) => {
      // Register a new language
      console.log('monaco mounting');
      monaco.languages.register({ id: 'mySpecialLanguage' });
      // Register a tokens provider for the language
      monaco.languages.setMonarchTokensProvider('mySpecialLanguage', {
        tokenizer: {
          root: [
            [/^([^ ]+) /, 'time-stamp'],
            [/\|(.*?)(?=\[)/s, 'event-type'],
            [/(.*(?:(EXCEPTION_THROWN|FATAL_ERROR)).*)/, 'exception-thrown'],
            [/(.*(?:(SYSTEM_MODE_ENTER|SYSTEM_MODE_END)).*)/, 'system-mode'],
            [/(.*(?:(USER_DEBUG)).*)/, 'debug'],
            [
              /(.*(?:(EXECUTION_STARTED|CODE_UNIT_STARTED|EXECUTION_FINISHED|CODE_UNIT_FINISHED|SOQL_EXECUTE_BEGIN|SOQL_EXECUTE_END|SOQL_EXECUTE_EXPLAIN|DML_BEGIN|DML_END)).*)/,
              'important-event',
            ],
          ],
        },
      });

      // Define a new theme that contains only rules that match this language
      monaco.editor.defineTheme('myCoolTheme', {
        base: 'vs',
        inherit: false,
        rules: [
          { token: 'time-stamp', foreground: '1b96ff' },
          { token: 'event-type', foreground: '0176d3' },
          {
            token: 'system-mode',
            foreground: 'b000ea',
            fontStyle: 'bold',
          },
          {
            token: 'exception-thrown',
            foreground: 'ea001e',
            fontStyle: 'bold',
          },
          {
            token: 'debug',
            foreground: '04844b',
            fontStyle: 'bold',
          },
          {
            token: 'important-event',
            foreground: '7074eb',
            fontStyle: 'bold',
          },
        ],
      });

      // Register a completion item provider for the new language
      monaco.languages.registerCompletionItemProvider('mySpecialLanguage', {
        provideCompletionItems: () => {
          const suggestions = [
            {
              label: 'simpleText',
              kind: monaco.languages.CompletionItemKind.Text,
              insertText: 'simpleText',
            },
            {
              label: 'testing',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: 'testing(${1:condition})',
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            },
            {
              label: 'ifelse',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: [
                'if (${1:condition}) {',
                '\t$0',
                '} else {',
                '\t',
                '}',
              ].join('\n'),
              insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'If-Else Statement',
            },
          ];
          return { suggestions };
        },
      });
      const fileContents = window.api.readLog(this.props.logPath);
      const text = monaco.editor.createModel(fileContents);

      const wrapper = document.getElementById('editor');
      wrapper.style.height = '95vh';
      const properties = {
        language: 'mySpecialLanguage',
        theme: 'myCoolTheme',
        automaticLayout: true,
      };

      const editor = monaco.editor.create(wrapper, properties);
      editor.setValue(fileContents);
    });
  }

  render() {
    return <div id="editor" />;
  }
}
