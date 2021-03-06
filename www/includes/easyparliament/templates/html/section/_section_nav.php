    <nav class="debate-navigation" role="navigation">
        <div class="full-page__row">
            <div class="full-page__unit">
                <div class="debate-navigation__pagination">
                    <?php if (isset($nextprev['prev'])) { ?>
                    <div class="debate-navigation__previous-debate">
                        <a href="<?= $nextprev['prev']['url'] ?>" rel="prev">&laquo; <?= $nextprev['prev']['body'] ?></a>
                    </div>
                    <?php } ?>

                    <?php if (isset($nextprev['up'])) { ?>
                    <div class="debate-navigation__all-debates">
                        <a href="<?= $nextprev['up']['url'] ?>" rel="up"><?= $nextprev['up']['body'] ?></a>
                    </div>
                    <?php } ?>

                    <?php if (isset($nextprev['next'])) { ?>
                    <div class="debate-navigation__next-debate">
                        <a href="<?= $nextprev['next']['url'] ?>" rel="next"><?= $nextprev['next']['body'] ?> &raquo;</a>
                    </div>
                    <?php } ?>
                </div>
            </div>
        </div>
    </nav>
