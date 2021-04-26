from itertools import groupby

def getListGroupPercentages(l, separator=', '):
    counts = [(key, len(list(g))) for key, g in groupby(sorted(l), lambda x: x)]
    percentages = [(key, count, round(100*count/len(l))) for (key, count) in counts]
    percentages = sorted(percentages, key=lambda x: x[1], reverse=True)
    return separator.join([f"'{key}' {'%d/%d' % (count, percentage)}%" for (key, count, percentage) in percentages])