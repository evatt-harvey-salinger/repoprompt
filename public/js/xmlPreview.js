// public/js/xmlPreview.js
// Generates XML output for the file mapping, file contents, and selected prompts,
// then updates the preview in the UI.

import { state } from './state.js';
import { formatTree, getSelectedPaths } from './fileTree.js';
import { getFileNodes, fetchFileContent } from './fileContent.js';
import { getPromptsXML } from './prompts.js';

/**
 * Updates the XML preview based on the current state.
 * @param {boolean} forceFullUpdate - Whether to force a full update.
 */
export async function updateXMLPreview(forceFullUpdate = false) {
  console.log('Updating XML preview...');

  // File map section
  let fileMapStr = `<file_map>\n${state.rootDirectory || 'No directory specified'}\n`;
  if (Object.keys(state.selectedTree).length > 0) {
    const treeLines = formatTree(state.selectedTree);
    treeLines.forEach(line => fileMapStr += line + "\n");
  } else {
    fileMapStr += "<!-- No files selected -->\n";
  }
  fileMapStr += `</file_map>`;

  // File contents section
  let fileContentsStr = `<file_contents>\n`;
  const fileNodes = getFileNodes(state.selectedTree);
  if (fileNodes.length > 0) {
    console.log(`Processing contents for ${fileNodes.length} files`);
    const fileContentsArray = await Promise.all(fileNodes.map(fileNode => fetchFileContent(fileNode)));
    fileContentsStr += fileContentsArray.join('');
  } else {
    console.log('No files selected for content fetching');
    fileContentsStr += `<!-- No file contents available -->\n`;
  }
  fileContentsStr += `</file_contents>`;

  // Prompts section
  let promptsStr = getPromptsXML();
  if (promptsStr === '') {
    promptsStr = `<!-- No prompts selected -->\n`;
  }

  // User instructions section
  const userInstructionsStr = `<user_instructions>\n${state.userInstructions}\n</user_instructions>`;

  const finalXML = `${fileMapStr}\n\n${fileContentsStr}\n\n${promptsStr}\n${userInstructionsStr}`;
  document.getElementById('xml-output').textContent = finalXML;
  console.log('XML preview updated');

  // Save state after updating the preview.
  import('./state.js').then(module => {
    module.saveStateToLocalStorage();
  });
}