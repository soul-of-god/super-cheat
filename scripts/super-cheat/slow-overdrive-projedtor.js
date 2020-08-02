
const lib = require('super-cheat/lib');

const healed = new IntSet();
extendContent(OverdriveProjector, "slow-overdrive-projector-01", {

    update(tile) {

        const tilesize = Vars.tilesize;
        const world = Vars.world;
        const range = this.range;
        const reload = this.reload;
        const speedBoost = this.speedBoost;

        var realRange = range;
        var realBoost = speedBoost;

        var tileRange = (realRange / tilesize + 1);
        healed.clear();

        for (var x = -tileRange + tile.x; x <= tileRange + tile.x; x++) {
            for (var y = -tileRange + tile.y; y <= tileRange + tile.y; y++) {
                if (!Mathf.within(x * tilesize, y * tilesize, tile.drawx(), tile.drawy(), realRange)) continue;

                var other = world.ltile(x, y);

                if (other == null) continue;

                if (!healed.contains(other.pos()) && other.entity != null) {
                    other.entity.timeScaleDuration = Math.max(other.entity.timeScaleDuration, reload + 1);
                    other.entity.timeScale = Math.min(realBoost);
                    healed.add(other.pos());
                }
            }
        }
    },
    // handleDamage(tile, amount) { return 0; },
    // handleBulletHit(entity, bullet) { },
});

extendContent(OverdriveProjector, "slow-overdrive-projector-05", {

    update(tile) {

        const tilesize = Vars.tilesize;
        const world = Vars.world;
        const range = this.range;
        const reload = this.reload;
        const speedBoost = this.speedBoost;

        var realRange = range;
        var realBoost = speedBoost;

        var tileRange = (realRange / tilesize + 1);
        healed.clear();

        for (var x = -tileRange + tile.x; x <= tileRange + tile.x; x++) {
            for (var y = -tileRange + tile.y; y <= tileRange + tile.y; y++) {
                if (!Mathf.within(x * tilesize, y * tilesize, tile.drawx(), tile.drawy(), realRange)) continue;

                var other = world.ltile(x, y);

                if (other == null) continue;

                if (!healed.contains(other.pos()) && other.entity != null) {
                    other.entity.timeScaleDuration = Math.max(other.entity.timeScaleDuration, reload + 1);
                    other.entity.timeScale = Math.min(realBoost);
                    healed.add(other.pos());
                }
            }
        }
    },
    // handleDamage(tile, amount) { return 0; },
    // handleBulletHit(entity, bullet) { },
});

(() => {

    function speedToText(speed) {
        var s = speed + "";
        if (s.length > 4) {
            return s.slice(0, s.length - 2);
        } else if (s.length > 2) {
            return s.slice(0, s.length - 2) + '.' + s.slice(s.length - 2, s.length);
        } else if (s.length == 2) {
            return "0." + s;
        } else {
            return "0.0" + s;
        }
    }

    const provEntity = prov(() => {

        var heat = 0;
        var charge = 1;
        var phaseHeat = 0;
        // 存储的是乘以 100 的整数
        var speedTo = 200;

        return extend(TileEntity, {
            getHeat() { return heat; },
            getCharge() { return charge; },
            getPhaseHeat() { return phaseHeat; },
            getSpeedTo() { return speedTo; },
            getSpeedToDecimal() { return speedTo / 100; },
            getSpeedToText() { return new Packages.java.lang.String(speedToText(speedTo)); },
            setHeat(v) { heat = v; },
            setCharge(v) { charge = v; },
            setPhaseHeat(v) { phaseHeat = v; },
            setSpeedTo(v) { speedTo = v; },

            write(stream) {
                this.super$write(stream);
                stream.writeFloat(heat);
                stream.writeFloat(phaseHeat);
                stream.writeFloat(speedTo);
            },
            read(stream, revision) {
                this.super$read(stream, revision);
                heat = stream.readFloat();
                phaseHeat = stream.readFloat();
                speedTo = stream.readFloat();
            },
        }
    )});

    var up1 =   Core.atlas.find("clear");
    var up2 =   Core.atlas.find("clear");
    var up3 =   Core.atlas.find("clear");
    var up4 =   Core.atlas.find("clear");
    var down1 = Core.atlas.find("clear");
    var down2 = Core.atlas.find("clear");
    var down3 = Core.atlas.find("clear");
    var down4 = Core.atlas.find("clear");

    const MAX = 1000 * 100;
    const MIN = 1;
    // 使用数组下标获取；存储的是乘以 100 的数字
    const commandMap = [1, 10, 100, 1000];


    const range = 120;
    const reload = 30;
    const baseColor = Color.valueOf("feb380");
    const phaseColor = Color.valueOf("ff9ed5");

    extendContent(Block, "adjustable-overdrive-projector", {

        load() {
            this.entityType = provEntity;
            this.update = true;
            this.solid = true;
            this.configurable = true;

            up1 =   new Packages.arc.scene.style.TextureRegionDrawable(lib.loadRegion("up1"));
            up2 =   new Packages.arc.scene.style.TextureRegionDrawable(lib.loadRegion("up2"));
            up3 =   new Packages.arc.scene.style.TextureRegionDrawable(lib.loadRegion("up3"));
            up4 =   new Packages.arc.scene.style.TextureRegionDrawable(lib.loadRegion("up4"));
            down1 = new Packages.arc.scene.style.TextureRegionDrawable(lib.loadRegion("down1"));
            down2 = new Packages.arc.scene.style.TextureRegionDrawable(lib.loadRegion("down2"));
            down3 = new Packages.arc.scene.style.TextureRegionDrawable(lib.loadRegion("down3"));
            down4 = new Packages.arc.scene.style.TextureRegionDrawable(lib.loadRegion("down4"));
            this.super$load();
        },
        buildConfiguration(tile, table) {
            table.addImageButton(up1, Styles.clearTransi, run(() => { tile.configure(0) })).size(40)
            table.addImageButton(up2, Styles.clearTransi, run(() => { tile.configure(1) })).size(40)
            table.addImageButton(up3, Styles.clearTransi, run(() => { tile.configure(2) })).size(40)
            table.addImageButton(up4, Styles.clearTransi, run(() => { tile.configure(3) })).size(40)
            table.row();
            table.addImageButton(down1, Styles.clearTransi, run(() => { tile.configure(100) })).size(40)
            table.addImageButton(down2, Styles.clearTransi, run(() => { tile.configure(101) })).size(40)
            table.addImageButton(down3, Styles.clearTransi, run(() => { tile.configure(102) })).size(40)
            table.addImageButton(down4, Styles.clearTransi, run(() => { tile.configure(103) })).size(40)
        },
        configured(tile, player, value) {
            const entity = tile.ent();
            // 小于 100 视为减小命令
            if (value >= 100) {
                var commandVal = commandMap[value - 100];
                var result = Math.max(MIN, entity.getSpeedTo() - commandVal);
                entity.setSpeedTo(result);
            } else {
                var commandVal = commandMap[value];
                var result = Math.min(MAX, entity.getSpeedTo() + commandVal);
                entity.setSpeedTo(result);
            }
        },
        drawPlace(x, y, rotation, valid) {
            const tilesize = Vars.tilesize;
            Drawf.dashCircle(x * tilesize + this.offset(), y * tilesize + this.offset(), range, Pal.accent);
        },
        drawLight(tile){
            Vars.renderer.lights.add(tile.drawx(), tile.drawy(), 50 * tile.entity.efficiency(),
                baseColor, 0.7 * tile.entity.efficiency());
        },
        drawSelect(tile){
            var entity = tile.ent();
            var realRange = range;

            Drawf.dashCircle(tile.drawx(), tile.drawy(), realRange, baseColor);
        },
        draw(tile){
            this.super$draw(tile);
            const tilesize = Vars.tilesize;
            var entity = tile.ent();
            if (entity) {
                var f = 1 - (Time.time() / 100) % 1;

                Draw.color(baseColor, phaseColor, entity.getPhaseHeat());
                Draw.alpha(entity.getHeat() * Mathf.absin(Time.time(), 10, 1) * 0.5);
                Draw.rect(this.topRegion, tile.drawx(), tile.drawy());
                Draw.alpha(1);
                Lines.stroke((2 * f + 0.2) * entity.getHeat());
                Lines.square(tile.drawx(), tile.drawy(), (1 - f) * 8);

                var font = Fonts.def;
                font.draw(entity.getSpeedToText(), entity.x, entity.y + 1.5, Color.purple, 0.18, false, Align.center);

                Draw.reset();
            }
        },
        update(tile) {

            const entity = tile.ent();
            const tilesize = Vars.tilesize;
            const world = Vars.world;
            const speedBoost = entity.getSpeedToDecimal();
            var realRange = range;
            var realBoost = speedBoost;

            var tileRange = (realRange / tilesize + 1);
            healed.clear();

            for (var x = -tileRange + tile.x; x <= tileRange + tile.x; x++) {
                for (var y = -tileRange + tile.y; y <= tileRange + tile.y; y++) {
                    if (!Mathf.within(x * tilesize, y * tilesize, tile.drawx(), tile.drawy(), realRange)) continue;

                    var other = world.ltile(x, y);

                    if (other == null) continue;

                    if (!healed.contains(other.pos()) && other.entity != null) {
                        if (
                            ((realBoost < 1 || other.entity.timeScale < 1) && realBoost < other.entity.timeScale)
                            || (realBoost > other.entity.timeScale)
                        ) {
                            other.entity.timeScaleDuration = Math.max(other.entity.timeScaleDuration, reload + 1);
                            other.entity.timeScale = realBoost;
                            healed.add(other.pos());
                        }
                    }
                }
            }
        },
    });
})();
