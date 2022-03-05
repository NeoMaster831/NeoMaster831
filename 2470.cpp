#include <cstdio>
#include <algorithm>
#include <vector>
#include <cmath>

using namespace std;

int main() {
	int N;
	pair<int, int> yongek[100001];
	scanf("%d", &N);

	int mini = 2000000003;
	pair<int, int> mini_val;

	for (int i = 0; i < N; i++) {
		scanf("%d", &yongek[i].first);
		yongek[i].second = i; // idx
	}

	sort(yongek, yongek + N);

	for (int i = 0; i < N; i++) {

		int left = 0;
		int right = N;
		int mid;

		while (left + 1 < right) {

			mid = (left + right) / 2;

			int val = yongek[mid].first;
			int adj = abs(val + yongek[i].first);

			// printf("%d %d %d, (%d %d)\n", left, mid, right, yongek[mid].second, yongek[i].second);
			//printf("mini: %d, adj: %d\n", mini, adj);

			if (mini > adj && yongek[mid].second != yongek[i].second) {

				//printf("mini val changed. : %d %d (mini: %d) -> ", mini_val.first, mini_val.second, mini);

				mini = adj;
				mini_val = make_pair(min(val, yongek[i].first), max(val, yongek[i].first));
				//printf("%d %d (mini: %d)\n", mini_val.first, mini_val.second, mini);
			}

			if (val + yongek[i].first >= 0) {
				right = mid;
			} else {
				left = mid;
			}
		}
	}

	printf("%d %d\n", mini_val.first, mini_val.second);
}
