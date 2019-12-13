#  Copyright (c) Daniel Kramer 2019.

import csv
import json

file = "spreadspoke_scores.csv"

rowNames = ["date", "season", "week", "isPlayoff", "homeTeam", "homeScore", "awayScore", "awayTeam"]

nameHistory = [["Arizona Cardinals", "Chicago Cardinals", "St. Louis Cardinals", "Phoenix Cardinals"],
               ["Chicago Bears", "Decatur Staleys"],
               ["Detroit Lions", "Portsmouth Spartans"],
               ["Indianapolis Colts", "Baltimore Colts"],
               ["Kansas City Chiefs", "Dallas Texans"],
               ["Los Angeles Rams", "Cleveland Rams", "St. Louis Rams"],
               ["New England Patriots", "Boston Patriots"],
               ["New York Jets", "New York Titans"],
               ["Oakland Raiders", "Los Angeles Raiders"],
               ["Pittsburgh Steelers", "Pittsburgh Pirates"],
               ["Los Angeles Chargers", "San Diego Chargers"],
               ["Tennessee Titans", "Houston Oilers", "Tennessee Oilers"],
               ["Washington Redskins", "Boston Braves", "Boston Redskins"]]


def modernizeName(name):
    for teamNameHistory in nameHistory:
        if name in teamNameHistory:
            return teamNameHistory[0]
    return name


def getData():
    data = []
    with open(file, 'r') as csvFile:
        reader = csv.reader(csvFile)
        for r in reader:
            data.append({n: d for n, d in zip(rowNames, r[0:8])})
    return data


def getJSON():
    data = getData()
    for d in data:
        d["homeTeam"] = modernizeName(d["homeTeam"])
        d["awayTeam"] = modernizeName(d["awayTeam"])
        d["homeScore"] = int(d["homeScore"])
        d["awayScore"] = int(d["awayScore"])
        d["winner"] = d["homeTeam"] if d["homeScore"] > d["awayScore"] else d["awayTeam"] if d["homeScore"] != d[
            "awayScore"] else "tie"
    with open('scores.json', 'w') as f:
        f.write(json.dumps(data))


getJSON()
