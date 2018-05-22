export function mapNameToCommaSeparated(nameArray: Array<string>, maxNamesToShow: number) {
  if (nameArray.length <= maxNamesToShow) {
    return nameArray.join(', ');
  }

  return nameArray.slice(0, maxNamesToShow).join(', ') + '...';
}
