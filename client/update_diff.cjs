const fs = require('fs');
const https = require('https');
const path = require('path');

const problemsFilePath = path.join(__dirname, 'src', 'data', 'problems.js');

https.get('https://leetcode.com/api/problems/algorithms/', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      const lcDiffMap = {};
      const levels = { 1: 'Easy', 2: 'Medium', 3: 'Hard' };
      
      parsed.stat_status_pairs.forEach(pair => {
        const slug = pair.stat.question__title_slug;
        const diff = levels[pair.difficulty.level];
        lcDiffMap[slug] = diff;
      });

      console.log(`Fetched ${Object.keys(lcDiffMap).length} problems from LeetCode.`);

      let content = fs.readFileSync(problemsFilePath, 'utf8');
      
      let updatedCount = 0;
      
      // We will match { id: 200, topic: '...', diff: '...', slug: '...' }
      // and replace the diff part.
      
      content = content.replace(/({[^}]*slug:\s*'([^']+)'[^}]*})/g, (match, fullObj, slug) => {
        const correctDiff = lcDiffMap[slug];
        if (correctDiff) {
          // Replace diff: 'Easy' with diff: 'correctDiff'
          updatedCount++;
          return fullObj.replace(/diff:\s*'[^']+'/, `diff: '${correctDiff}'`);
        } else {
          console.log(`Warning: slug ${slug} not found in LeetCode!`);
        }
        return fullObj;
      });

      fs.writeFileSync(problemsFilePath, content, 'utf8');
      console.log(`Successfully updated ${updatedCount} problem difficulties in problems.js!`);
    } catch (e) {
      console.error('Error parsing JSON or updating:', e);
    }
  });
}).on('error', err => {
  console.error('Network Error:', err.message);
});
