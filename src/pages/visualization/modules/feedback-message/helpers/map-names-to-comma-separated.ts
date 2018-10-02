export function mapNameToCommaSeparated(
  nameArray: any[],
  maxNamesToShow: number
) {
  if (nameArray.length <= maxNamesToShow) {
    return nameArray.join(', ');
  }

  return nameArray.slice(0, maxNamesToShow).join(', ') + '...';
}
