#include <cstdio>
#include <math.h>
#include <vector>

using namespace std;
#define POWFIX(x, y) (int)(pow(x, y) + 0.000001);

int adj[11][10];

int main() {

	int L, U;
	scanf("%d %d", &L, &U);
	int LD[11], UD[11];
	int LF[11], UF[11];
	int LK[11], UK[11];

	int digits = 1;
	int UC = U; int LC = L;
	LK[0] = 0; UK[0] = 0; LD[0] = 0; UD[0] = 0;
	while (UC) {
		LD[digits] = LC % 10; UD[digits] = UC % 10;
		LF[digits] = LC / 10; UF[digits] = UC / 10;
		LK[digits] = LK[digits - 1] + LD[digits - 1] * POWFIX(10, digits - 2);
		UK[digits] = UK[digits - 1] + UD[digits - 1] * POWFIX(10, digits - 2);

		UC /= 10; LC /= 10;
		digits++;
	}

  /*
	for (int i = 1; i < digits; i++) {
		printf("%d: LD: %d, LF: %d, LK: %d, UD: %d, UF: %d, UK: %d\n", i, LD[i], LF[i], LK[i], UD[i], UF[i], UK[i]);
	}
  */

	for (int i = 1; i < digits; i++) {

    int weight = POWFIX(10, i - 1);
    for (int j = 0; j <= 9; j++) {
      adj[i][j] += (UF[i] - LF[i]) * weight;
    }

    if (LD[i] > UD[i]) {
      for (int j = UD[i] + 1; j < LD[i]; j++) {
        adj[i][j] -= weight; // digits = 1일때 1이 되어야 함
      }

    } else {

      // printf("%d %d\n", LD[i], UD[i]);
      for (int j = LD[i]; j <= UD[i]; j++) {
        adj[i][j] += weight;
      }
    }
    adj[i][LD[i]] -= LK[i];
    adj[i][UD[i]] -= weight - UK[i] - 1;
	}


  /*
  for (int i = 1; i < digits; i++) {
    for (int j = 0; j <= 9; j++) {
      printf("%d ", adj[i][j]);
    }
    printf("\n");
  }
  */

  long long ans = 0;
  for (int i = 0; i <= 9; i++) {
    for (int j = 1; j < digits; j++) {
      ans += adj[j][i] * i;
    }
  }

  printf("%lld", ans);
}
