const getReleaseLine = async (
  changeset,
  _type,
  options
) => {

  const [firstLine, ...futureLines] = changeset.summary
    .split("\n")
    .map((l) => l.trimRight());

  const commitShortId = changeset.commit?.slice(0, 7);
  const commitLink = options?.repo ? `[${commitShortId}](https://github.com/${options.repo}/commit/${changeset.commit})` : commitShortId;
  let returnVal = `- ${changeset.commit ? `${commitLink}: ` : ""
    }${firstLine}`;

  if (futureLines.length > 0) {
    returnVal += `\n${futureLines.map((l) => `  ${l}`).join("\n")}`;
  }

  const issueRegex = /#(\d+)/g;
  returnVal = returnVal.replace(issueRegex, (_, issueNumber) => {
    return `[#${issueNumber}](https://github.com/${options.repo}/issues/${issueNumber})`;
  });

  return returnVal;
};

const getDependencyReleaseLine = async (
  changesets,
  dependenciesUpdated,
  options
) => {
  if (dependenciesUpdated.length === 0) return "";


  const changesetLinks = changesets.map(
    (changeset) => {
      const commitShortId = changeset.commit?.slice(0, 7);
      const commitLink = options?.repo ? `[${commitShortId}](https://github.com/${options.repo}/commit/${changeset.commit})` : commitShortId;
      return `- Updated dependencies${changeset.commit ? ` [${commitLink}]` : ""
        }`;
    }
  );

  const updatedDependenciesList = dependenciesUpdated.map(
    (dependency) => `  - ${dependency.name}@${dependency.newVersion}`
  );

  return [...changesetLinks, ...updatedDependenciesList].join("\n");
};

const defaultChangelogFunctions = {
  getReleaseLine,
  getDependencyReleaseLine,
};

module.exports = defaultChangelogFunctions;